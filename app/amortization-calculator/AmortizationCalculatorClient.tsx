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
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  startMonth: string;
  extraMonthlyPayment: string;
  oneTimeExtraPayment: string;
  annualExtraPayment: string;
};

type MonthlyRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPaid: number;
  totalPaid: number;
  remainingBalance: number;
};

type AnnualRow = {
  year: number;
  month: number;
  principal: number;
  interest: number;
  extraPaid: number;
  totalPaid: number;
  remainingBalance: number;
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
    name: "30-year mortgage",
    description: "Standard long-term mortgage amortization.",
    loanAmount: "300000",
    interestRate: "6.5",
    loanTerm: "30",
    startMonth: "2026-01",
    extraMonthlyPayment: "0",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "0",
  },
  {
    name: "15-year mortgage",
    description: "Shorter term with faster principal payoff.",
    loanAmount: "300000",
    interestRate: "6.1",
    loanTerm: "15",
    startMonth: "2026-01",
    extraMonthlyPayment: "0",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "0",
  },
  {
    name: "Extra monthly payment",
    description: "Add a recurring extra principal payment.",
    loanAmount: "300000",
    interestRate: "6.5",
    loanTerm: "30",
    startMonth: "2026-01",
    extraMonthlyPayment: "200",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "0",
  },
  {
    name: "Annual bonus payment",
    description: "Apply a yearly bonus toward principal.",
    loanAmount: "280000",
    interestRate: "6.25",
    loanTerm: "25",
    startMonth: "2026-01",
    extraMonthlyPayment: "100",
    oneTimeExtraPayment: "0",
    annualExtraPayment: "3000",
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

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  if (currency === "JPY") {
    return `${sign}${symbol}${Math.round(absoluteValue).toLocaleString(
      "en-US"
    )}`;
  }

  return `${sign}${symbol}${absoluteValue.toLocaleString("en-US", {
    maximumFractionDigits: absoluteValue >= 1000 ? 0 : 2,
    minimumFractionDigits: absoluteValue >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0.00%";
  }

  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}%`;
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

function formatMonthLabel(startMonth: string, monthOffset: number) {
  const [yearString, monthString] = startMonth.split("-");
  const year = Number(yearString);
  const month = Number(monthString);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return "—";
  }

  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + Math.max(0, monthOffset));

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatPayoffDate(startMonth: string, payoffMonths: number | null) {
  if (payoffMonths === null || !Number.isFinite(payoffMonths)) {
    return "—";
  }

  return formatMonthLabel(startMonth, Math.max(0, Math.ceil(payoffMonths) - 1));
}

function getMonthlyPayment({
  loanAmount,
  annualRate,
  termYears,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
}) {
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function simulateAmortization({
  loanAmount,
  annualRate,
  termYears,
  extraMonthlyPayment,
  oneTimeExtraPayment,
  annualExtraPayment,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  extraMonthlyPayment: number;
  oneTimeExtraPayment: number;
  annualExtraPayment: number;
}) {
  const monthlyRate = annualRate / 100 / 12;
  const baseMonthlyPayment = getMonthlyPayment({
    loanAmount,
    annualRate,
    termYears,
  });

  let remainingBalance = loanAmount;
  let month = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPaid = 0;
  let totalExtraPaid = 0;

  const rows: MonthlyRow[] = [];

  while (remainingBalance > 0.01 && month < 1200) {
    month += 1;

    const interest = remainingBalance * monthlyRate;

    let requestedExtraPayment = extraMonthlyPayment;

    if (month === 1) {
      requestedExtraPayment += oneTimeExtraPayment;
    }

    if (month % 12 === 0) {
      requestedExtraPayment += annualExtraPayment;
    }

    const requestedPayment = baseMonthlyPayment + requestedExtraPayment;

    if (requestedPayment <= interest && remainingBalance > 0) {
      return {
        payoffMonths: null,
        baseMonthlyPayment,
        totalInterest: Number.POSITIVE_INFINITY,
        totalPrincipal,
        totalPaid: Number.POSITIVE_INFINITY,
        totalExtraPaid,
        monthlyRows: rows,
        annualRows: getAnnualRows(rows),
        neverPaysOff: true,
      };
    }

    let principal = requestedPayment - interest;
    let actualPayment = requestedPayment;

    if (principal > remainingBalance) {
      principal = remainingBalance;
      actualPayment = principal + interest;
    }

    const scheduledPaid = Math.min(baseMonthlyPayment, actualPayment);
    const extraPaid = Math.max(0, actualPayment - scheduledPaid);

    remainingBalance -= principal;
    totalInterest += interest;
    totalPrincipal += principal;
    totalPaid += actualPayment;
    totalExtraPaid += extraPaid;

    rows.push({
      month,
      payment: actualPayment,
      principal,
      interest,
      extraPaid,
      totalPaid,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return {
    payoffMonths: remainingBalance <= 0.01 ? month : null,
    baseMonthlyPayment,
    totalInterest,
    totalPrincipal,
    totalPaid,
    totalExtraPaid,
    monthlyRows: rows,
    annualRows: getAnnualRows(rows),
    neverPaysOff: false,
  };
}

function getAnnualRows(monthlyRows: MonthlyRow[]) {
  const annualRows: AnnualRow[] = [];

  monthlyRows.forEach((row) => {
    const year = Math.ceil(row.month / 12);
    const existingRow = annualRows.find((annualRow) => annualRow.year === year);

    if (existingRow) {
      existingRow.month = row.month;
      existingRow.principal += row.principal;
      existingRow.interest += row.interest;
      existingRow.extraPaid += row.extraPaid;
      existingRow.totalPaid += row.payment;
      existingRow.remainingBalance = row.remainingBalance;
    } else {
      annualRows.push({
        year,
        month: row.month,
        principal: row.principal,
        interest: row.interest,
        extraPaid: row.extraPaid,
        totalPaid: row.payment,
        remainingBalance: row.remainingBalance,
      });
    }
  });

  return annualRows;
}

function getAmortizationLabel({
  interestSaved,
  monthsSaved,
  totalExtraPaid,
}: {
  interestSaved: number;
  monthsSaved: number;
  totalExtraPaid: number;
}) {
  if (totalExtraPaid <= 0) {
    return {
      label: "Standard amortization schedule",
      description:
        "This schedule shows how each regular payment is split between interest and principal over time.",
    };
  }

  if (monthsSaved >= 60 && interestSaved > 0) {
    return {
      label: "Major payoff acceleration",
      description:
        "The extra payment strategy could shorten the loan by several years and reduce total interest significantly.",
    };
  }

  if (monthsSaved >= 24 && interestSaved > 0) {
    return {
      label: "Strong amortization improvement",
      description:
        "The extra payments could meaningfully reduce both payoff time and total interest.",
    };
  }

  if (monthsSaved > 0 || interestSaved > 0) {
    return {
      label: "Some payoff improvement",
      description:
        "The extra payments may reduce interest and help pay down the loan faster.",
    };
  }

  return {
    label: "Review your inputs",
    description:
      "The current extra payment setup does not create a clear payoff improvement. Check the loan details and payment assumptions.",
  };
}

export default function AmortizationCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [loanAmount, setLoanAmount] = useState("300000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [startMonth, setStartMonth] = useState("2026-01");

  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState("0");
  const [oneTimeExtraPayment, setOneTimeExtraPayment] = useState("0");
  const [annualExtraPayment, setAnnualExtraPayment] = useState("0");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const parsedLoanAmount = parseNumber(loanAmount);
    const parsedInterestRate = parseNumber(interestRate);
    const parsedLoanTerm = parseNumber(loanTerm);
    const parsedExtraMonthlyPayment = parseNumber(extraMonthlyPayment);
    const parsedOneTimeExtraPayment = parseNumber(oneTimeExtraPayment);
    const parsedAnnualExtraPayment = parseNumber(annualExtraPayment);

    const baseline = simulateAmortization({
      loanAmount: parsedLoanAmount,
      annualRate: parsedInterestRate,
      termYears: parsedLoanTerm,
      extraMonthlyPayment: 0,
      oneTimeExtraPayment: 0,
      annualExtraPayment: 0,
    });

    const accelerated = simulateAmortization({
      loanAmount: parsedLoanAmount,
      annualRate: parsedInterestRate,
      termYears: parsedLoanTerm,
      extraMonthlyPayment: parsedExtraMonthlyPayment,
      oneTimeExtraPayment: parsedOneTimeExtraPayment,
      annualExtraPayment: parsedAnnualExtraPayment,
    });

    const interestSaved =
      Number.isFinite(baseline.totalInterest) &&
      Number.isFinite(accelerated.totalInterest)
        ? baseline.totalInterest - accelerated.totalInterest
        : 0;

    const monthsSaved =
      baseline.payoffMonths !== null && accelerated.payoffMonths !== null
        ? baseline.payoffMonths - accelerated.payoffMonths
        : 0;

    const firstPayment = accelerated.monthlyRows[0] || null;

    const health = getAmortizationLabel({
      interestSaved,
      monthsSaved,
      totalExtraPaid: accelerated.totalExtraPaid,
    });

    return {
      loanAmount: parsedLoanAmount,
      interestRate: parsedInterestRate,
      loanTerm: parsedLoanTerm,
      extraMonthlyPayment: parsedExtraMonthlyPayment,
      oneTimeExtraPayment: parsedOneTimeExtraPayment,
      annualExtraPayment: parsedAnnualExtraPayment,
      baseline,
      accelerated,
      interestSaved,
      monthsSaved,
      firstPayment,
      health,
    };
  }, [
    loanAmount,
    interestRate,
    loanTerm,
    extraMonthlyPayment,
    oneTimeExtraPayment,
    annualExtraPayment,
  ]);

  function validateInputs() {
    if (result.loanAmount <= 0) {
      setError("Loan amount must be greater than zero.");
      return false;
    }

    if (result.interestRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (result.loanTerm <= 0 || result.loanTerm > 50) {
      setError("Loan term must be between 1 and 50 years.");
      return false;
    }

    if (!/^\d{4}-\d{2}$/.test(startMonth)) {
      setError("Start month must be a valid month.");
      return false;
    }

    if (
      result.extraMonthlyPayment < 0 ||
      result.oneTimeExtraPayment < 0 ||
      result.annualExtraPayment < 0
    ) {
      setError("Extra payments cannot be negative.");
      return false;
    }

    if (result.accelerated.neverPaysOff) {
      setError(
        "The loan does not amortize with these inputs. Check the payment, interest rate and loan term."
      );
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setLoanAmount(scenario.loanAmount);
    setInterestRate(scenario.interestRate);
    setLoanTerm(scenario.loanTerm);
    setStartMonth(scenario.startMonth);
    setExtraMonthlyPayment(scenario.extraMonthlyPayment);
    setOneTimeExtraPayment(scenario.oneTimeExtraPayment);
    setAnnualExtraPayment(scenario.annualExtraPayment);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Build an amortization schedule
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate monthly payment, interest, principal, payoff date and an
          annual amortization schedule for a mortgage, personal loan or other
          installment loan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly payment"
          value={formatCurrency(
            result.accelerated.baseMonthlyPayment,
            currency
          )}
          highlight
        />

        <StatCard
          label="Total interest"
          value={formatCurrency(result.accelerated.totalInterest, currency)}
        />

        <StatCard
          label="Payoff date"
          value={formatPayoffDate(startMonth, result.accelerated.payoffMonths)}
        />
      </div>

      <ToolResultBox title="Loan inputs">
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
              label="Loan amount"
              value={loanAmount}
              onChange={setLoanAmount}
              currency={currency}
              helper="Original loan balance or amount borrowed."
            />

            <PercentInput
              label="Interest rate"
              value={interestRate}
              onChange={setInterestRate}
              helper="Annual interest rate for the loan."
            />

            <NumberInput
              label="Loan term"
              value={loanTerm}
              onChange={setLoanTerm}
              suffix="years"
              helper="Length of the loan in years."
            />

            <MonthInput
              label="Start month"
              value={startMonth}
              onChange={setStartMonth}
              helper="Used to estimate the payoff date."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Optional extra payments">
        <div className="grid gap-4 sm:grid-cols-3">
          <MoneyInput
            label="Extra monthly payment"
            value={extraMonthlyPayment}
            onChange={setExtraMonthlyPayment}
            currency={currency}
            helper="Additional principal paid every month."
          />

          <MoneyInput
            label="One-time extra payment"
            value={oneTimeExtraPayment}
            onChange={setOneTimeExtraPayment}
            currency={currency}
            helper="Extra principal payment applied in the first month."
          />

          <MoneyInput
            label="Annual extra payment"
            value={annualExtraPayment}
            onChange={setAnnualExtraPayment}
            currency={currency}
            helper="Extra principal payment applied once per year."
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
          Calculate amortization
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Amortization result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Monthly payment"
                value={formatCurrency(
                  result.accelerated.baseMonthlyPayment,
                  currency
                )}
                highlight
              />

              <StatCard
                label="Payoff time"
                value={formatDuration(result.accelerated.payoffMonths)}
              />

              <StatCard
                label="Payoff date"
                value={formatPayoffDate(
                  startMonth,
                  result.accelerated.payoffMonths
                )}
              />

              <StatCard
                label="Total interest"
                value={formatCurrency(result.accelerated.totalInterest, currency)}
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

          <ToolResultBox title="Payment summary">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total principal"
                value={formatCurrency(
                  result.accelerated.totalPrincipal,
                  currency
                )}
              />

              <StatCard
                label="Total interest"
                value={formatCurrency(result.accelerated.totalInterest, currency)}
              />

              <StatCard
                label="Total paid"
                value={formatCurrency(result.accelerated.totalPaid, currency)}
                highlight
              />

              <StatCard
                label="Total extra paid"
                value={formatCurrency(
                  result.accelerated.totalExtraPaid,
                  currency
                )}
              />
            </div>

            <div className="mt-5 grid gap-3">
              <BreakdownRow
                label="Loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <BreakdownRow
                label="Interest rate"
                value={formatPercent(result.interestRate)}
              />

              <BreakdownRow
                label="Loan term"
                value={`${result.loanTerm} years`}
              />

              <BreakdownRow
                label="Base monthly payment"
                value={formatCurrency(
                  result.accelerated.baseMonthlyPayment,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Extra payment impact">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Interest saved"
                value={formatCurrency(result.interestSaved, currency)}
                highlight
              />

              <StatCard
                label="Time saved"
                value={formatDuration(result.monthsSaved)}
              />

              <StatCard
                label="Original payoff"
                value={formatDuration(result.baseline.payoffMonths)}
              />

              <StatCard
                label="New payoff"
                value={formatDuration(result.accelerated.payoffMonths)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                Extra principal payments
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Extra payments are assumed to reduce principal directly. Actual
                results depend on your lender, payment timing and whether extra
                payments are applied to principal.
              </p>
            </div>
          </ToolResultBox>

          {result.firstPayment && (
            <ToolResultBox title="First payment breakdown">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Payment"
                  value={formatCurrency(result.firstPayment.payment, currency)}
                />

                <StatCard
                  label="Interest"
                  value={formatCurrency(result.firstPayment.interest, currency)}
                />

                <StatCard
                  label="Principal"
                  value={formatCurrency(
                    result.firstPayment.principal,
                    currency
                  )}
                  highlight
                />

                <StatCard
                  label="Remaining balance"
                  value={formatCurrency(
                    result.firstPayment.remainingBalance,
                    currency
                  )}
                />
              </div>
            </ToolResultBox>
          )}

          <TogglePanel
            title="Annual amortization schedule"
            description="Open the schedule to review principal, interest, extra payments and remaining balance by year."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-6 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 lg:grid">
                <div>Year</div>
                <div>Date</div>
                <div>Principal</div>
                <div>Interest</div>
                <div>Total paid</div>
                <div>Balance</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.accelerated.annualRows.map((row) => (
                  <div
                    key={`${row.year}-${row.month}`}
                    className="grid gap-3 px-4 py-4 text-sm lg:grid-cols-6 lg:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Year
                      </div>
                      <div className="font-bold text-black">{row.year}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Date
                      </div>
                      <div className="font-bold text-black">
                        {formatMonthLabel(startMonth, row.month - 1)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Principal
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.principal, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Interest
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.interest, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Total paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.totalPaid, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Balance
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.remainingBalance, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>

          <TogglePanel
            title="Amortization formulas"
            description="Open the formula summary to see how payment, interest and principal are estimated."
          >
            <div className="grid gap-3">
              <BreakdownRow
                label="Monthly payment"
                value="Calculated from loan amount, interest rate and loan term."
              />

              <BreakdownRow
                label="Monthly interest"
                value="Remaining balance × monthly interest rate."
              />

              <BreakdownRow
                label="Principal paid"
                value="Payment minus interest, plus any extra principal payment."
              />

              <BreakdownRow
                label="Remaining balance"
                value="Previous balance minus principal paid."
              />
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This amortization calculator provides estimates for planning purposes
        only. Actual loan schedules can vary based on lender rules, payment
        timing, fees, compounding, escrow, prepayment policies and whether extra
        payments are applied directly to principal.
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

function MonthInput({
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

      <input
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />

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

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-sm font-black text-black">{value}</div>
    </div>
  );
}