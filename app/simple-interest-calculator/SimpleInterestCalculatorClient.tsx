"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type YearlyRow = {
  year: number;
  elapsedYears: number;
  interest: number;
  tax: number;
  afterTaxAmount: number;
  inflationAdjustedAmount: number;
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function formatYears(years: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(years)} year${years === 1 ? "" : "s"}`;
}

function calculateSimpleInterest({
  principal,
  annualRate,
  years,
  taxRate,
  inflationRate,
}: {
  principal: number;
  annualRate: number;
  years: number;
  taxRate: number;
  inflationRate: number;
}) {
  if (
    principal < 0 ||
    annualRate < 0 ||
    annualRate > 100 ||
    years < 0 ||
    taxRate < 0 ||
    taxRate > 100 ||
    inflationRate < 0 ||
    inflationRate > 100
  ) {
    return null;
  }

  const interest = principal * (annualRate / 100) * years;
  const tax = interest * (taxRate / 100);
  const afterTaxInterest = interest - tax;
  const finalAmount = principal + interest;
  const afterTaxAmount = principal + afterTaxInterest;
  const inflationAdjustedAmount =
    afterTaxAmount / Math.pow(1 + inflationRate / 100, years);

  const compoundAmount = principal * Math.pow(1 + annualRate / 100, years);
  const compoundInterest = compoundAmount - principal;
  const compoundDifference = compoundInterest - interest;
  const inflationImpact = afterTaxAmount - inflationAdjustedAmount;
  const realGain = inflationAdjustedAmount - principal;

  const totalReturn = principal > 0 ? (interest / principal) * 100 : 0;
  const afterTaxReturn =
    principal > 0 ? (afterTaxInterest / principal) * 100 : 0;
  const averageAnnualAfterTaxReturn =
    years > 0 && principal > 0 ? afterTaxReturn / years : 0;

  const yearlyRows: YearlyRow[] = [];

  for (let year = 1; year <= Math.ceil(years); year += 1) {
    const elapsedYears = Math.min(year, years);
    const yearlyInterest = principal * (annualRate / 100) * elapsedYears;
    const yearlyTax = yearlyInterest * (taxRate / 100);
    const yearlyAfterTaxAmount = principal + yearlyInterest - yearlyTax;
    const yearlyInflationAdjustedAmount =
      yearlyAfterTaxAmount /
      Math.pow(1 + inflationRate / 100, elapsedYears);

    yearlyRows.push({
      year,
      elapsedYears,
      interest: yearlyInterest,
      tax: yearlyTax,
      afterTaxAmount: yearlyAfterTaxAmount,
      inflationAdjustedAmount: yearlyInflationAdjustedAmount,
    });
  }

  return {
    interest,
    tax,
    afterTaxInterest,
    finalAmount,
    afterTaxAmount,
    inflationAdjustedAmount,
    compoundAmount,
    compoundInterest,
    compoundDifference,
    inflationImpact,
    realGain,
    totalReturn,
    afterTaxReturn,
    averageAnnualAfterTaxReturn,
    yearlyRows,
  };
}

export default function SimpleInterestCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("5");
  const [years, setYears] = useState("3");
  const [taxRate, setTaxRate] = useState("0");
  const [inflationRate, setInflationRate] = useState("2");
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      principal: parseNumber(principal),
      annualRate: parseNumber(annualRate),
      years: parseNumber(years),
      taxRate: parseNumber(taxRate),
      inflationRate: parseNumber(inflationRate),
    }),
    [principal, annualRate, years, taxRate, inflationRate]
  );

  const result = useMemo(
    () =>
      calculateSimpleInterest({
        principal: numericValues.principal,
        annualRate: numericValues.annualRate,
        years: numericValues.years,
        taxRate: numericValues.taxRate,
        inflationRate: numericValues.inflationRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (numericValues.principal < 0 || numericValues.years < 0) {
      setError("Principal amount and time cannot be negative.");
      return false;
    }

    if (
      numericValues.annualRate < 0 ||
      numericValues.annualRate > 100 ||
      numericValues.inflationRate < 0 ||
      numericValues.inflationRate > 100
    ) {
      setError("Interest and inflation rates must be between 0 and 100.");
      return false;
    }

    if (numericValues.taxRate < 0 || numericValues.taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setPrincipal("10000");
    setAnnualRate("5");
    setYears("3");
    setTaxRate("0");
    setInflationRate("2");
    setShowYearlySummary(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    nextPrincipal,
    nextRate,
    nextYears,
    nextTax,
    nextInflation,
  }: {
    nextPrincipal: string;
    nextRate: string;
    nextYears: string;
    nextTax: string;
    nextInflation: string;
  }) {
    setPrincipal(nextPrincipal);
    setAnnualRate(nextRate);
    setYears(nextYears);
    setTaxRate(nextTax);
    setInflationRate(nextInflation);
    setShowYearlySummary(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate simple interest online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate simple interest, final amount, after-tax interest,
          inflation-adjusted value and the difference compared with compound
          interest.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Principal"
          value={formatCurrency(numericValues.principal, currency)}
        />

        <StatCard
          label="Interest rate"
          value={formatPercent(numericValues.annualRate)}
        />

        <StatCard label="Time" value={formatYears(numericValues.years)} />
      </div>

      <ToolResultBox title="Simple interest details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </label>

          <TextNumberInput
            label="Principal amount"
            value={principal}
            onChange={setPrincipal}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Annual interest rate"
            value={annualRate}
            onChange={setAnnualRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Time"
            value={years}
            onChange={setYears}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Tax rate on interest"
            value={taxRate}
            onChange={setTaxRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Inflation rate"
            value={inflationRate}
            onChange={setInflationRate}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextPrincipal: "10000",
                nextRate: "5",
                nextYears: "3",
                nextTax: "0",
                nextInflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Savings example
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextPrincipal: "5000",
                nextRate: "8",
                nextYears: "2",
                nextTax: "25",
                nextInflation: "3",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Taxed interest
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextPrincipal: "25000",
                nextRate: "6.5",
                nextYears: "5",
                nextTax: "15",
                nextInflation: "2.5",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Loan interest
          </button>

          <button
            type="button"
            onClick={resetExample}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Reset example
          </button>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <>
          <ToolResultBox title="Simple interest result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Final amount"
                value={formatCurrency(result.finalAmount, currency)}
                highlight
              />

              <ResultCard
                label="Simple interest"
                value={formatCurrency(result.interest, currency)}
              />

              <ResultCard
                label="After-tax amount"
                value={formatCurrency(result.afterTaxAmount, currency)}
              />

              <ResultCard
                label="After-tax interest"
                value={formatCurrency(result.afterTaxInterest, currency)}
              />

              <ResultCard
                label="Estimated tax"
                value={formatCurrency(result.tax, currency)}
              />

              <ResultCard
                label="Inflation-adjusted value"
                value={formatCurrency(result.inflationAdjustedAmount, currency)}
              />

              <ResultCard
                label="After-tax return"
                value={formatPercent(result.afterTaxReturn)}
              />

              <ResultCard
                label="Compound difference"
                value={formatCurrency(result.compoundDifference, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Simple interest earned:{" "}
              <strong className="text-black">
                {formatCurrency(result.interest, currency)}
              </strong>
              . After tax, the estimated amount is{" "}
              <strong className="text-black">
                {formatCurrency(result.afterTaxAmount, currency)}
              </strong>
              . Inflation-adjusted value is approximately{" "}
              <strong className="text-black">
                {formatCurrency(result.inflationAdjustedAmount, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Return breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Simple interest return"
                percentage={result.totalReturn}
                formattedValue={formatCurrency(result.interest, currency)}
              />

              <BreakdownBar
                label="After-tax return"
                percentage={result.afterTaxReturn}
                formattedValue={formatCurrency(result.afterTaxInterest, currency)}
              />

              <BreakdownBar
                label="Average annual after-tax return"
                percentage={result.averageAnnualAfterTaxReturn}
                formattedValue={formatPercent(
                  result.averageAnnualAfterTaxReturn
                )}
              />

              <BreakdownBar
                label="Inflation impact"
                percentage={
                  result.afterTaxAmount > 0
                    ? (result.inflationImpact / result.afterTaxAmount) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.inflationImpact, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Yearly simple interest summary"
              description="Show estimated interest, tax and inflation-adjusted value by year."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {result.yearlyRows.map((row) => (
                  <div
                    key={row.year}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-black text-black">
                          Year {row.year}
                        </div>

                        <div className="mt-1 text-xs text-black/50">
                          Elapsed time: {formatYears(row.elapsedYears)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-black">
                          {formatCurrency(row.afterTaxAmount, currency)}
                        </div>

                        <div className="mt-1 text-xs font-bold text-black/45">
                          Interest {formatCurrency(row.interest, currency)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">Tax</div>

                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.tax, currency)}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">
                          Inflation-adjusted
                        </div>

                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.inflationAdjustedAmount, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TogglePanel>

            <TogglePanel
              title="Simple interest formula"
              description="Show the formula and how this calculator handles tax and inflation."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="Simple interest"
                  text="Simple interest = principal × annual interest rate × time."
                />

                <FormulaCard
                  title="Final amount"
                  text="Final amount = principal + simple interest."
                />

                <FormulaCard
                  title="After-tax amount"
                  text="After-tax amount = principal + interest after estimated tax."
                />

                <FormulaCard
                  title="Inflation-adjusted value"
                  text="Inflation-adjusted value estimates the future amount in today's purchasing power."
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid interest assumptions to calculate simple interest.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Simple interest does not compound. It is useful for basic interest
        estimates, but many savings accounts, investments and loans use compound
        interest or more complex rules.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-black">{value}</div>
    </div>
  );
}

function ResultCard({
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
      className={`rounded-2xl border p-5 ${
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

function BreakdownBar({
  label,
  percentage,
  formattedValue,
}: {
  label: string;
  percentage: number;
  formattedValue: string;
}) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {formatPercent(percentage)}
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}

function FormulaCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="text-sm font-black text-black">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-black/60">{text}</p>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-black">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-black/5"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}