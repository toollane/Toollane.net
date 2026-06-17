"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF ",
  JPY: "¥",
};

type CurrencyCode = keyof typeof currencySymbols;

type Scenario = {
  name: string;
  description: string;
  loanBalance: string;
  interestRate: string;
  remainingTerm: string;
  monthlyPayment: string;
  extraMonthlyPayment: string;
  oneTimeExtraPayment: string;
  annualExtraPayment: string;
};

type PayoffRow = {
  year: number;
  month: number;
  remainingBalance: number;
  interestPaid: number;
  principalPaid: number;
  totalPaid: number;
};

const currencyOptions: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const scenarios: Scenario[] = [
  {
    name: "Small extra payment",
    description: "Add a modest monthly extra payment.",
    loanBalance: "300000",
    interestRate: "6.5",
    remainingTerm: "28",
    monthlyPayment: "1947",
    extraMonthlyPayment: "100",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "0",
  },
  {
    name: "Accelerated payoff",
    description: "Add a larger monthly extra payment.",
    loanBalance: "300000",
    interestRate: "6.5",
    remainingTerm: "28",
    monthlyPayment: "1947",
    extraMonthlyPayment: "300",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "0",
  },
  {
    name: "Annual bonus",
    description: "Use an annual bonus to reduce principal.",
    loanBalance: "280000",
    interestRate: "6.25",
    remainingTerm: "25",
    monthlyPayment: "1847",
    extraMonthlyPayment: "100",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "3000",
  },
  {
    name: "One-time principal drop",
    description: "Apply a one-time extra payment now.",
    loanBalance: "350000",
    interestRate: "6.75",
    remainingTerm: "30",
    monthlyPayment: "2270",
    extraMonthlyPayment: "150",
    oneTimeExtraPayment: "10000",
    annualExtraPayment: "0",
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const symbol = currencySymbols[currency];

  if (!Number.isFinite(value)) {
    return `${symbol}0`;
  }

  if (currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
  }

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatDuration(months: number | null) {
  if (months === null || !Number.isFinite(months)) {
    return "—";
  }

  const roundedMonths = Math.max(0, Math.round(months));
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;

  if (years <= 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${years} years`;
  }

  return `${years} years ${remainingMonths} months`;
}

function formatPayoffDate(months: number | null) {
  if (months === null || !Number.isFinite(months)) {
    return "—";
  }

  const date = new Date();
  date.setMonth(date.getMonth() + Math.ceil(months));

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getCalculatedPayment({
  balance,
  annualRate,
  termYears,
}: {
  balance: number;
  annualRate: number;
  termYears: number;
}) {
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRate / 100 / 12;

  if (balance <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return balance / months;
  }

  return (
    (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function simulatePayoff({
  balance,
  annualRate,
  baseMonthlyPayment,
  extraMonthlyPayment,
  oneTimeExtraPayment,
  annualExtraPayment,
}: {
  balance: number;
  annualRate: number;
  baseMonthlyPayment: number;
  extraMonthlyPayment: number;
  oneTimeExtraPayment: number;
  annualExtraPayment: number;
}) {
  const monthlyRate = annualRate / 100 / 12;
  let remainingBalance = balance;
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let principalPaidTotal = 0;

  const rows: PayoffRow[] = [];

  while (remainingBalance > 0.01 && month < 1200) {
    month += 1;

    const interest = remainingBalance * monthlyRate;

    let scheduledPayment = baseMonthlyPayment;
    let extraPayment = extraMonthlyPayment;

    if (month === 1) {
      extraPayment += oneTimeExtraPayment;
    }

    if (month % 12 === 0) {
      extraPayment += annualExtraPayment;
    }

    let totalPaymentThisMonth = scheduledPayment + extraPayment;

    if (totalPaymentThisMonth <= interest) {
      return {
        payoffMonths: null,
        totalInterest: Number.POSITIVE_INFINITY,
        totalPaid: Number.POSITIVE_INFINITY,
        principalPaid: principalPaidTotal,
        rows,
        neverPaysOff: true,
      };
    }

    let principalPayment = totalPaymentThisMonth - interest;

    if (principalPayment > remainingBalance) {
      principalPayment = remainingBalance;
      totalPaymentThisMonth = principalPayment + interest;
    }

    remainingBalance -= principalPayment;
    totalInterest += interest;
    totalPaid += totalPaymentThisMonth;
    principalPaidTotal += principalPayment;

    if (month % 12 === 0 || remainingBalance <= 0.01) {
      rows.push({
        year: Math.ceil(month / 12),
        month,
        remainingBalance: Math.max(0, remainingBalance),
        interestPaid: totalInterest,
        principalPaid: principalPaidTotal,
        totalPaid,
      });
    }
  }

  return {
    payoffMonths: remainingBalance <= 0.01 ? month : null,
    totalInterest,
    totalPaid,
    principalPaid: principalPaidTotal,
    rows,
    neverPaysOff: false,
  };
}

function getPayoffLabel(monthsSaved: number, interestSaved: number) {
  if (monthsSaved <= 0 && interestSaved <= 0) {
    return {
      label: "No payoff improvement",
      description:
        "The extra payment strategy does not reduce payoff time or interest with these inputs.",
    };
  }

  if (monthsSaved >= 60 && interestSaved > 0) {
    return {
      label: "Major payoff acceleration",
      description:
        "Your extra payments could shorten the mortgage by several years and save substantial interest.",
    };
  }

  if (monthsSaved >= 24 && interestSaved > 0) {
    return {
      label: "Strong payoff improvement",
      description:
        "Your extra payments could meaningfully reduce both payoff time and total interest.",
    };
  }

  if (monthsSaved > 0 || interestSaved > 0) {
    return {
      label: "Some savings",
      description:
        "Your extra payments may reduce interest and help pay off the loan faster.",
    };
  }

  return {
    label: "Review your inputs",
    description:
      "Try increasing extra payments or checking that the base payment is high enough to reduce principal.",
  };
}

export default function MortgagePayoffCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [loanBalance, setLoanBalance] = useState("300000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [remainingTerm, setRemainingTerm] = useState("28");
  const [monthlyPayment, setMonthlyPayment] = useState("1947");
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("100");
  const [oneTimeExtraPayment, setOneTimeExtraPayment] = useState("0");
  const [annualExtraPayment, setAnnualExtraPayment] = useState("0");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const balance = parseNumber(loanBalance);
    const rate = parseNumber(interestRate);
    const term = parseNumber(remainingTerm);
    const enteredMonthlyPayment = parseNumber(monthlyPayment);
    const extraMonthly = parseNumber(extraMonthlyPayment);
    const oneTimeExtra = parseNumber(oneTimeExtraPayment);
    const annualExtra = parseNumber(annualExtraPayment);

    const calculatedMonthlyPayment = getCalculatedPayment({
      balance,
      annualRate: rate,
      termYears: term,
    });

    const baseMonthlyPayment =
      enteredMonthlyPayment > 0 ? enteredMonthlyPayment : calculatedMonthlyPayment;

    const baseline = simulatePayoff({
      balance,
      annualRate: rate,
      baseMonthlyPayment,
      extraMonthlyPayment: 0,
      oneTimeExtraPayment: 0,
      annualExtraPayment: 0,
    });

    const accelerated = simulatePayoff({
      balance,
      annualRate: rate,
      baseMonthlyPayment,
      extraMonthlyPayment: extraMonthly,
      oneTimeExtraPayment: oneTimeExtra,
      annualExtraPayment: annualExtra,
    });

    const payoffMonthsSaved =
      baseline.payoffMonths !== null && accelerated.payoffMonths !== null
        ? baseline.payoffMonths - accelerated.payoffMonths
        : 0;

    const interestSaved =
      Number.isFinite(baseline.totalInterest) &&
      Number.isFinite(accelerated.totalInterest)
        ? baseline.totalInterest - accelerated.totalInterest
        : 0;

    const totalExtraPayments =
      Number.isFinite(accelerated.totalPaid) && Number.isFinite(baseline.totalPaid)
        ? Math.max(0, accelerated.totalPaid - baseline.totalPaid + interestSaved)
        : 0;

    const monthlyInterest = balance * (rate / 100 / 12);
    const principalInFirstPayment = Math.max(0, baseMonthlyPayment - monthlyInterest);

    const health = getPayoffLabel(payoffMonthsSaved, interestSaved);

    return {
      balance,
      rate,
      term,
      enteredMonthlyPayment,
      calculatedMonthlyPayment,
      baseMonthlyPayment,
      extraMonthly,
      oneTimeExtra,
      annualExtra,
      baseline,
      accelerated,
      payoffMonthsSaved,
      interestSaved,
      totalExtraPayments,
      monthlyInterest,
      principalInFirstPayment,
      health,
    };
  }, [
    loanBalance,
    interestRate,
    remainingTerm,
    monthlyPayment,
    extraMonthlyPayment,
    oneTimeExtraPayment,
    annualExtraPayment,
  ]);

  function validateInputs() {
    if (result.balance <= 0) {
      setError("Loan balance must be greater than zero.");
      return false;
    }

    if (result.rate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (result.term <= 0) {
      setError("Remaining term must be greater than zero.");
      return false;
    }

    if (result.baseMonthlyPayment <= result.monthlyInterest) {
      setError(
        "Monthly payment must be higher than the first month's interest. Otherwise the loan will not amortize."
      );
      return false;
    }

    if (
      result.extraMonthly < 0 ||
      result.oneTimeExtra < 0 ||
      result.annualExtra < 0
    ) {
      setError("Extra payments cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setLoanBalance(scenario.loanBalance);
    setInterestRate(scenario.interestRate);
    setRemainingTerm(scenario.remainingTerm);
    setMonthlyPayment(scenario.monthlyPayment);
    setExtraMonthlyPayment(scenario.extraMonthlyPayment);
    setOneTimeExtraPayment(scenario.oneTimeExtraPayment);
    setAnnualExtraPayment(scenario.annualExtraPayment);
    setError("");
  }

  function useCalculatedPayment() {
    setMonthlyPayment(result.calculatedMonthlyPayment.toFixed(2));
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate mortgage payoff savings
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how monthly, annual or one-time extra payments can shorten
          your mortgage, reduce interest and move your payoff date earlier.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Time saved"
          value={formatDuration(result.payoffMonthsSaved)}
          highlight
        />

        <StatCard
          label="Interest saved"
          value={formatCurrency(result.interestSaved, currency)}
        />

        <StatCard
          label="New payoff date"
          value={formatPayoffDate(result.accelerated.payoffMonths)}
        />
      </div>

      <ToolResultBox title="Mortgage inputs">
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyInput
              label="Current loan balance"
              value={loanBalance}
              onChange={setLoanBalance}
              currency={currency}
              helper="Remaining principal balance on the mortgage."
            />

            <PercentInput
              label="Interest rate"
              value={interestRate}
              onChange={setInterestRate}
              helper="Annual mortgage interest rate."
            />

            <NumberInput
              label="Remaining term"
              value={remainingTerm}
              onChange={setRemainingTerm}
              suffix="years"
              helper="Estimated years remaining on the current mortgage."
            />

            <MoneyInput
              label="Current monthly payment"
              value={monthlyPayment}
              onChange={setMonthlyPayment}
              currency={currency}
              helper="Principal and interest payment. Use calculated payment if unsure."
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-black text-black">
                  Calculated payment
                </div>

                <p className="mt-1 text-xs leading-5 text-black/60">
                  Based on balance, rate and remaining term:{" "}
                  <strong>
                    {formatCurrency(result.calculatedMonthlyPayment, currency)}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={useCalculatedPayment}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Use calculated
              </button>
            </div>
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Extra payment strategy">
        <div className="grid gap-4 sm:grid-cols-3">
          <MoneyInput
            label="Extra monthly payment"
            value={extraMonthlyPayment}
            onChange={setExtraMonthlyPayment}
            currency={currency}
            helper="Additional amount paid every month toward principal."
          />

          <MoneyInput
            label="One-time extra payment"
            value={oneTimeExtraPayment}
            onChange={setOneTimeExtraPayment}
            currency={currency}
            helper="Extra payment applied immediately in month one."
          />

          <MoneyInput
            label="Annual extra payment"
            value={annualExtraPayment}
            onChange={setAnnualExtraPayment}
            currency={currency}
            helper="Extra amount applied once per year."
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Quick scenarios">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              type="button"
              onClick={() => applyScenario(scenario)}
              className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:bg-black/[0.02]"
            >
              <div className="text-sm font-black text-black">
                {scenario.name}
              </div>

              <div className="mt-2 text-xs leading-5 text-black/50">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={validateInputs}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Calculate payoff savings
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Mortgage payoff result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Original payoff"
                value={formatDuration(result.baseline.payoffMonths)}
              />

              <StatCard
                label="New payoff"
                value={formatDuration(result.accelerated.payoffMonths)}
                highlight
              />

              <StatCard
                label="Time saved"
                value={formatDuration(result.payoffMonthsSaved)}
              />

              <StatCard
                label="New payoff date"
                value={formatPayoffDate(result.accelerated.payoffMonths)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {result.health.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {result.health.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Interest savings">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Interest without extras"
                value={formatCurrency(result.baseline.totalInterest, currency)}
              />

              <StatCard
                label="Interest with extras"
                value={formatCurrency(result.accelerated.totalInterest, currency)}
              />

              <StatCard
                label="Interest saved"
                value={formatCurrency(result.interestSaved, currency)}
                highlight
              />

              <StatCard
                label="Total extra principal"
                value={formatCurrency(result.totalExtraPayments, currency)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Payment details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Base monthly payment"
                value={formatCurrency(result.baseMonthlyPayment, currency)}
              />

              <StatCard
                label="Extra monthly payment"
                value={formatCurrency(result.extraMonthly, currency)}
              />

              <StatCard
                label="First month interest"
                value={formatCurrency(result.monthlyInterest, currency)}
              />

              <StatCard
                label="First month principal"
                value={formatCurrency(result.principalInFirstPayment, currency)}
                highlight
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Payoff projection"
            description="Open the projection table to review balance, interest and principal over time with extra payments."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-5 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Year</div>
                <div>Balance</div>
                <div>Interest paid</div>
                <div>Principal paid</div>
                <div>Total paid</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.accelerated.rows.map((row) => (
                  <div
                    key={`${row.year}-${row.month}`}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-5 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Year
                      </div>
                      <div className="font-bold text-black">{row.year}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Balance
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.remainingBalance, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Interest paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.interestPaid, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Principal paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.principalPaid, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Total paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.totalPaid, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This calculator estimates mortgage payoff savings from extra principal
        payments. Results depend on your actual loan terms, payment schedule,
        lender rules and whether extra payments are applied directly to
        principal.
      </ToolInfoBox>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-5 text-left"
      >
        <div>
          <h3 className="text-lg font-black tracking-tight text-black">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/60">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-bold text-white">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  currency,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: CurrencyCode;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
          {currencySymbols[currency]}
        </div>

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function PercentInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
          %
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
          {suffix}
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}