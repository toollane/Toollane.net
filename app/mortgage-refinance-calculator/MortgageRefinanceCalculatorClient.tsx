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
  currentBalance: string;
  currentRate: string;
  remainingTerm: string;
  newRate: string;
  newTerm: string;
  closingCosts: string;
  discountPoints: string;
  rollCosts: "yes" | "no";
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
    name: "Rate drop refinance",
    description: "Lower rate with similar remaining term.",
    currentBalance: "320000",
    currentRate: "7",
    remainingTerm: "27",
    newRate: "5.75",
    newTerm: "30",
    closingCosts: "6500",
    discountPoints: "0",
    rollCosts: "no",
  },
  {
    name: "Shorter term",
    description: "Refinance to a shorter mortgage term.",
    currentBalance: "280000",
    currentRate: "6.5",
    remainingTerm: "25",
    newRate: "5.9",
    newTerm: "15",
    closingCosts: "5500",
    discountPoints: "0",
    rollCosts: "no",
  },
  {
    name: "Low-cost refinance",
    description: "Lower upfront cost with smaller rate improvement.",
    currentBalance: "400000",
    currentRate: "6.8",
    remainingTerm: "28",
    newRate: "6.25",
    newTerm: "30",
    closingCosts: "2500",
    discountPoints: "0",
    rollCosts: "yes",
  },
  {
    name: "Points buy-down",
    description: "Pay points to reduce the new interest rate.",
    currentBalance: "350000",
    currentRate: "7.25",
    remainingTerm: "29",
    newRate: "5.75",
    newTerm: "30",
    closingCosts: "6000",
    discountPoints: "1",
    rollCosts: "no",
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

function formatMonths(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  if (value >= 120) {
    return `${(value / 12).toFixed(1)} years`;
  }

  return `${value.toFixed(1)} months`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(Math.abs(value) >= 10 ? 1 : 2)}%`;
}

function getMortgagePayment({
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

function getRefinanceLabel({
  monthlySavings,
  breakEvenMonths,
  netLifetimeSavings,
}: {
  monthlySavings: number;
  breakEvenMonths: number | null;
  netLifetimeSavings: number;
}) {
  if (monthlySavings <= 0 && netLifetimeSavings <= 0) {
    return {
      label: "Refinance may not save money",
      description:
        "The new loan does not reduce monthly payments or lifetime cost based on these assumptions.",
    };
  }

  if (breakEvenMonths !== null && breakEvenMonths <= 24 && netLifetimeSavings > 0) {
    return {
      label: "Strong refinance candidate",
      description:
        "The refinance has a relatively short break-even period and positive estimated lifetime savings.",
    };
  }

  if (breakEvenMonths !== null && breakEvenMonths <= 60 && netLifetimeSavings > 0) {
    return {
      label: "Potentially worthwhile",
      description:
        "The refinance may be worthwhile if you expect to keep the mortgage long enough to pass the break-even point.",
    };
  }

  if (netLifetimeSavings > 0) {
    return {
      label: "Long-term savings possible",
      description:
        "Lifetime savings are positive, but the break-even period may be long.",
    };
  }

  return {
    label: "Review carefully",
    description:
      "Monthly savings may exist, but total long-term savings are limited after refinance costs.",
  };
}

export default function MortgageRefinanceCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [currentBalance, setCurrentBalance] = useState("320000");
  const [currentRate, setCurrentRate] = useState("7");
  const [remainingTerm, setRemainingTerm] = useState("27");

  const [newRate, setNewRate] = useState("5.75");
  const [newTerm, setNewTerm] = useState("30");
  const [closingCosts, setClosingCosts] = useState("6500");
  const [discountPoints, setDiscountPoints] = useState("0");
  const [rollCosts, setRollCosts] = useState<"yes" | "no">("no");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const balance = parseNumber(currentBalance);
    const oldRate = parseNumber(currentRate);
    const oldTerm = parseNumber(remainingTerm);

    const refinanceRate = parseNumber(newRate);
    const refinanceTerm = parseNumber(newTerm);
    const fixedClosingCosts = parseNumber(closingCosts);
    const points = parseNumber(discountPoints);

    const pointsCost = balance * (points / 100);
    const totalRefinanceCosts = fixedClosingCosts + pointsCost;
    const costsRolledIntoLoan = rollCosts === "yes";

    const newLoanAmount = costsRolledIntoLoan
      ? balance + totalRefinanceCosts
      : balance;

    const currentPayment = getMortgagePayment({
      loanAmount: balance,
      annualRate: oldRate,
      termYears: oldTerm,
    });

    const refinancePayment = getMortgagePayment({
      loanAmount: newLoanAmount,
      annualRate: refinanceRate,
      termYears: refinanceTerm,
    });

    const oldMonths = Math.max(1, Math.round(oldTerm * 12));
    const newMonths = Math.max(1, Math.round(refinanceTerm * 12));

    const monthlySavings = currentPayment - refinancePayment;

    const breakEvenMonths =
      monthlySavings > 0 ? totalRefinanceCosts / monthlySavings : null;

    const currentTotalPayments = currentPayment * oldMonths;
    const refinanceTotalPayments =
      refinancePayment * newMonths + (costsRolledIntoLoan ? 0 : totalRefinanceCosts);

    const currentTotalInterest = Math.max(0, currentTotalPayments - balance);
    const refinanceTotalInterest = Math.max(
      0,
      refinancePayment * newMonths - newLoanAmount
    );

    const interestSavings = currentTotalInterest - refinanceTotalInterest;
    const netLifetimeSavings = currentTotalPayments - refinanceTotalPayments;

    const paymentReductionPercent =
      currentPayment > 0 ? (monthlySavings / currentPayment) * 100 : 0;

    const upfrontCashNeeded = costsRolledIntoLoan ? 0 : totalRefinanceCosts;

    const projectionYears = [1, 2, 3, 5, 7, 10, 15, 20, 30].filter(
      (year) => year <= Math.max(oldTerm, refinanceTerm)
    );

    const projection = projectionYears.map((year) => {
      const months = Math.round(year * 12);
      const currentPaid = currentPayment * Math.min(months, oldMonths);
      const refinancePaid =
        refinancePayment * Math.min(months, newMonths) +
        (costsRolledIntoLoan ? 0 : totalRefinanceCosts);

      const netSavings = currentPaid - refinancePaid;

      return {
        year,
        currentPaid,
        refinancePaid,
        netSavings,
        status: netSavings > 0 ? "Savings" : "Cost",
      };
    });

    const health = getRefinanceLabel({
      monthlySavings,
      breakEvenMonths,
      netLifetimeSavings,
    });

    return {
      balance,
      oldRate,
      oldTerm,
      refinanceRate,
      refinanceTerm,
      fixedClosingCosts,
      points,
      pointsCost,
      totalRefinanceCosts,
      costsRolledIntoLoan,
      newLoanAmount,
      currentPayment,
      refinancePayment,
      oldMonths,
      newMonths,
      monthlySavings,
      breakEvenMonths,
      currentTotalPayments,
      refinanceTotalPayments,
      currentTotalInterest,
      refinanceTotalInterest,
      interestSavings,
      netLifetimeSavings,
      paymentReductionPercent,
      upfrontCashNeeded,
      projection,
      health,
    };
  }, [
    currentBalance,
    currentRate,
    remainingTerm,
    newRate,
    newTerm,
    closingCosts,
    discountPoints,
    rollCosts,
  ]);

  function validateInputs() {
    if (result.balance <= 0) {
      setError("Current loan balance must be greater than zero.");
      return false;
    }

    if (result.oldRate < 0 || result.refinanceRate < 0) {
      setError("Interest rates cannot be negative.");
      return false;
    }

    if (result.oldTerm <= 0 || result.refinanceTerm <= 0) {
      setError("Loan terms must be greater than zero.");
      return false;
    }

    if (result.fixedClosingCosts < 0 || result.points < 0) {
      setError("Refinance costs and points cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setCurrentBalance(scenario.currentBalance);
    setCurrentRate(scenario.currentRate);
    setRemainingTerm(scenario.remainingTerm);
    setNewRate(scenario.newRate);
    setNewTerm(scenario.newTerm);
    setClosingCosts(scenario.closingCosts);
    setDiscountPoints(scenario.discountPoints);
    setRollCosts(scenario.rollCosts);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compare your current mortgage with a refinance
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate monthly savings, refinance costs, break-even time, total
          interest and lifetime savings from refinancing your mortgage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly savings"
          value={formatCurrency(result.monthlySavings, currency)}
          highlight
        />

        <StatCard
          label="Break-even"
          value={formatMonths(result.breakEvenMonths)}
        />

        <StatCard
          label="Lifetime savings"
          value={formatCurrency(result.netLifetimeSavings, currency)}
        />
      </div>

      <ToolResultBox title="Current mortgage">
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

          <div className="grid gap-4 sm:grid-cols-3">
            <MoneyInput
              label="Current loan balance"
              value={currentBalance}
              onChange={setCurrentBalance}
              currency={currency}
              helper="Remaining principal balance on your current mortgage."
            />

            <PercentInput
              label="Current interest rate"
              value={currentRate}
              onChange={setCurrentRate}
              helper="Annual interest rate on your current mortgage."
            />

            <NumberInput
              label="Remaining term"
              value={remainingTerm}
              onChange={setRemainingTerm}
              suffix="years"
              helper="Estimated years remaining on your current loan."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Refinance option">
        <div className="grid gap-4 sm:grid-cols-2">
          <PercentInput
            label="New interest rate"
            value={newRate}
            onChange={setNewRate}
            helper="Annual interest rate on the refinance mortgage."
          />

          <NumberInput
            label="New loan term"
            value={newTerm}
            onChange={setNewTerm}
            suffix="years"
            helper="Length of the new mortgage."
          />

          <MoneyInput
            label="Closing costs"
            value={closingCosts}
            onChange={setClosingCosts}
            currency={currency}
            helper="Estimated refinance closing costs."
          />

          <PercentInput
            label="Discount points"
            value={discountPoints}
            onChange={setDiscountPoints}
            helper="Points paid as a percentage of the current loan balance."
          />

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">
              Roll refinance costs into loan?
            </span>

            <select
              value={rollCosts}
              onChange={(event) =>
                setRollCosts(event.target.value as "yes" | "no")
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="no">No — pay costs upfront</option>
              <option value="yes">Yes — add costs to the new loan</option>
            </select>

            <p className="mt-2 text-xs leading-5 text-black/50">
              Rolling costs into the loan reduces upfront cash needed but can
              increase the new payment and total interest.
            </p>
          </label>
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
          Calculate refinance savings
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Refinance result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Current payment"
                value={formatCurrency(result.currentPayment, currency)}
              />

              <StatCard
                label="New payment"
                value={formatCurrency(result.refinancePayment, currency)}
              />

              <StatCard
                label="Monthly savings"
                value={formatCurrency(result.monthlySavings, currency)}
                highlight
              />

              <StatCard
                label="Payment change"
                value={formatPercent(result.paymentReductionPercent)}
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

          <ToolResultBox title="Cost and break-even">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total refinance costs"
                value={formatCurrency(result.totalRefinanceCosts, currency)}
              />

              <StatCard
                label="Points cost"
                value={formatCurrency(result.pointsCost, currency)}
              />

              <StatCard
                label="Upfront cash needed"
                value={formatCurrency(result.upfrontCashNeeded, currency)}
              />

              <StatCard
                label="Break-even time"
                value={formatMonths(result.breakEvenMonths)}
                highlight
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Lifetime comparison">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Current total payments"
                value={formatCurrency(result.currentTotalPayments, currency)}
              />

              <StatCard
                label="Refinance total payments"
                value={formatCurrency(result.refinanceTotalPayments, currency)}
              />

              <StatCard
                label="Interest savings"
                value={formatCurrency(result.interestSavings, currency)}
              />

              <StatCard
                label="Net lifetime savings"
                value={formatCurrency(result.netLifetimeSavings, currency)}
                highlight
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="New loan details">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="New loan amount"
                value={formatCurrency(result.newLoanAmount, currency)}
              />

              <StatCard
                label="Costs rolled into loan"
                value={result.costsRolledIntoLoan ? "Yes" : "No"}
              />

              <StatCard
                label="New loan term"
                value={`${result.refinanceTerm} years`}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Savings projection"
            description="Open the projection table to compare cumulative payments and estimated net savings over time."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-5 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Year</div>
                <div>Current paid</div>
                <div>Refinance paid</div>
                <div>Net savings</div>
                <div>Status</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projection.map((row) => (
                  <div
                    key={row.year}
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
                        Current paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.currentPaid, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Refinance paid
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.refinancePaid, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Net savings
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.netSavings, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Status
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          row.status === "Savings"
                            ? "bg-black text-white"
                            : "bg-black/10 text-black"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This calculator provides an estimate only. Refinance decisions depend on
        actual lender offers, credit profile, loan type, taxes, escrow, points,
        closing costs and how long you plan to keep the mortgage.
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