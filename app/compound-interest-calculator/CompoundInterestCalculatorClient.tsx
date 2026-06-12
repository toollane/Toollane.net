"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ContributionFrequency = "monthly" | "quarterly" | "yearly";
type CompoundingFrequency = "daily" | "monthly" | "quarterly" | "yearly";

type YearlyRow = {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
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

function getContributionsPerYear(frequency: ContributionFrequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

function getCompoundsPerYear(frequency: CompoundingFrequency) {
  if (frequency === "daily") return 365;
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

function getFrequencyLabel(
  frequency: ContributionFrequency | CompoundingFrequency
) {
  if (frequency === "daily") return "Daily";
  if (frequency === "monthly") return "Monthly";
  if (frequency === "quarterly") return "Quarterly";
  return "Yearly";
}

function calculateCompoundInterest({
  principal,
  regularContribution,
  contributionFrequency,
  annualRate,
  years,
  compoundingFrequency,
  taxRate,
  inflationRate,
}: {
  principal: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualRate: number;
  years: number;
  compoundingFrequency: CompoundingFrequency;
  taxRate: number;
  inflationRate: number;
}) {
  if (
    principal < 0 ||
    regularContribution < 0 ||
    annualRate < 0 ||
    years <= 0 ||
    taxRate < 0 ||
    taxRate > 100 ||
    inflationRate < 0
  ) {
    return null;
  }

  const totalYears = Math.round(years);
  const compoundsPerYear = getCompoundsPerYear(compoundingFrequency);
  const contributionPeriodsPerYear =
    getContributionsPerYear(contributionFrequency);
  const totalCompoundPeriods = totalYears * compoundsPerYear;
  const periodicRate = annualRate / 100 / compoundsPerYear;
  const contributionEveryPeriods = Math.max(
    1,
    Math.round(compoundsPerYear / contributionPeriodsPerYear)
  );

  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  const yearlyRows: YearlyRow[] = [];

  for (let period = 1; period <= totalCompoundPeriods; period++) {
    const interest = balance * periodicRate;

    balance += interest;
    totalInterest += interest;

    if (period % contributionEveryPeriods === 0) {
      balance += regularContribution;
      totalContributions += regularContribution;
    }

    if (period % compoundsPerYear === 0 || period === totalCompoundPeriods) {
      const year = Math.ceil(period / compoundsPerYear);

      yearlyRows.push({
        year,
        balance,
        contributions: totalContributions,
        interest: totalInterest,
      });
    }
  }

  const estimatedTax = totalInterest * (taxRate / 100);
  const afterTaxValue = balance - estimatedTax;
  const inflationAdjustedValue =
    afterTaxValue / Math.pow(1 + inflationRate / 100, totalYears);
  const interestShare =
    balance > 0 ? Math.max(0, Math.min(100, (totalInterest / balance) * 100)) : 0;
  const contributionShare =
    balance > 0
      ? Math.max(0, Math.min(100, (totalContributions / balance) * 100))
      : 0;
  const taxImpact =
    balance > 0 ? Math.max(0, Math.min(100, (estimatedTax / balance) * 100)) : 0;

  return {
    finalBalance: balance,
    afterTaxValue,
    inflationAdjustedValue,
    totalContributions,
    totalInterest,
    estimatedTax,
    interestShare,
    contributionShare,
    taxImpact,
    totalYears,
    compoundsPerYear,
    yearlyRows,
  };
}

export default function CompoundInterestCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [principal, setPrincipal] = useState("10000");
  const [regularContribution, setRegularContribution] = useState("250");
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [annualRate, setAnnualRate] = useState("7");
  const [years, setYears] = useState("20");
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>("monthly");
  const [taxRate, setTaxRate] = useState("0");
  const [inflationRate, setInflationRate] = useState("2");
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      principal: parseNumber(principal),
      regularContribution: parseNumber(regularContribution),
      annualRate: parseNumber(annualRate),
      years: parseNumber(years),
      taxRate: parseNumber(taxRate),
      inflationRate: parseNumber(inflationRate),
    }),
    [
      principal,
      regularContribution,
      annualRate,
      years,
      taxRate,
      inflationRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal: numericValues.principal,
        regularContribution: numericValues.regularContribution,
        contributionFrequency,
        annualRate: numericValues.annualRate,
        years: numericValues.years,
        compoundingFrequency,
        taxRate: numericValues.taxRate,
        inflationRate: numericValues.inflationRate,
      }),
    [numericValues, contributionFrequency, compoundingFrequency]
  );

  function validateInputs() {
    if (
      numericValues.principal < 0 ||
      numericValues.regularContribution < 0
    ) {
      setError("Initial amount and contribution cannot be negative.");
      return false;
    }

    if (numericValues.annualRate < 0 || numericValues.inflationRate < 0) {
      setError("Interest rate and inflation rate cannot be negative.");
      return false;
    }

    if (numericValues.years <= 0) {
      setError("Years must be greater than zero.");
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
    setRegularContribution("250");
    setContributionFrequency("monthly");
    setAnnualRate("7");
    setYears("20");
    setCompoundingFrequency("monthly");
    setTaxRate("0");
    setInflationRate("2");
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    initial,
    contribution,
    contributionEvery,
    rate,
    duration,
    compoundEvery,
    tax,
    inflation,
  }: {
    initial: string;
    contribution: string;
    contributionEvery: ContributionFrequency;
    rate: string;
    duration: string;
    compoundEvery: CompoundingFrequency;
    tax: string;
    inflation: string;
  }) {
    setPrincipal(initial);
    setRegularContribution(contribution);
    setContributionFrequency(contributionEvery);
    setAnnualRate(rate);
    setYears(duration);
    setCompoundingFrequency(compoundEvery);
    setTaxRate(tax);
    setInflationRate(inflation);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate compound interest online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate future value with compound interest, recurring contributions,
          compounding frequency, taxes and inflation adjustment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Final balance"
          value={result ? formatCurrency(result.finalBalance, currency) : "—"}
        />
        <StatCard
          label="Interest earned"
          value={result ? formatCurrency(result.totalInterest, currency) : "—"}
        />
        <StatCard
          label="Compounding"
          value={getFrequencyLabel(compoundingFrequency)}
        />
      </div>

      <ToolResultBox title="Compound interest details">
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
            label="Initial amount"
            value={principal}
            onChange={setPrincipal}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Regular contribution"
            value={regularContribution}
            onChange={setRegularContribution}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <label className="block">
            <span className="text-sm font-bold text-black">
              Contribution frequency
            </span>

            <select
              value={contributionFrequency}
              onChange={(event) =>
                setContributionFrequency(
                  event.target.value as ContributionFrequency
                )
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Compounding frequency
            </span>

            <select
              value={compoundingFrequency}
              onChange={(event) =>
                setCompoundingFrequency(
                  event.target.value as CompoundingFrequency
                )
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>

          <TextNumberInput
            label="Annual interest rate"
            value={annualRate}
            onChange={setAnnualRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Years"
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
                initial: "10000",
                contribution: "250",
                contributionEvery: "monthly",
                rate: "7",
                duration: "20",
                compoundEvery: "monthly",
                tax: "0",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Wealth building
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                initial: "5000",
                contribution: "500",
                contributionEvery: "monthly",
                rate: "6",
                duration: "15",
                compoundEvery: "monthly",
                tax: "15",
                inflation: "2.5",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Retirement investing
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                initial: "2000",
                contribution: "300",
                contributionEvery: "monthly",
                rate: "4.5",
                duration: "8",
                compoundEvery: "monthly",
                tax: "0",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            House down payment
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
          <ToolResultBox title="Compound interest result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Final balance"
                value={formatCurrency(result.finalBalance, currency)}
                highlight
              />

              <ResultCard
                label="After-tax value"
                value={formatCurrency(result.afterTaxValue, currency)}
              />

              <ResultCard
                label="Inflation-adjusted"
                value={formatCurrency(result.inflationAdjustedValue, currency)}
              />

              <ResultCard
                label="Interest earned"
                value={formatCurrency(result.totalInterest, currency)}
              />

              <ResultCard
                label="Total contributions"
                value={formatCurrency(result.totalContributions, currency)}
              />

              <ResultCard
                label="Estimated tax"
                value={formatCurrency(result.estimatedTax, currency)}
              />

              <ResultCard
                label="Compounds per year"
                value={String(result.compoundsPerYear)}
              />

              <ResultCard
                label="Investment period"
                value={`${result.totalYears} years`}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              After {result.totalYears} years, your estimated balance is{" "}
              <strong className="text-black">
                {formatCurrency(result.finalBalance, currency)}
              </strong>
              . This includes{" "}
              <strong className="text-black">
                {formatCurrency(result.totalInterest, currency)}
              </strong>{" "}
              in estimated compound interest.
            </div>
          </ToolResultBox>

          <ToolResultBox title="Compound interest breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Total contributions"
                percentage={result.contributionShare}
                formattedValue={formatCurrency(
                  result.totalContributions,
                  currency
                )}
              />

              <BreakdownBar
                label="Compound interest"
                percentage={result.interestShare}
                formattedValue={formatCurrency(result.totalInterest, currency)}
              />

              <BreakdownBar
                label="Estimated tax impact"
                percentage={result.taxImpact}
                formattedValue={formatCurrency(result.estimatedTax, currency)}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Yearly compound interest summary"
            description="Show estimated balance, contributions and compound interest by year."
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
                        Contributions:{" "}
                        {formatCurrency(row.contributions, currency)} ·
                        Interest: {formatCurrency(row.interest, currency)}
                      </div>
                    </div>

                    <div className="text-right text-sm font-black text-black">
                      {formatCurrency(row.balance, currency)}
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, (row.balance / result.finalBalance) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TogglePanel>
        </>
      ) : (
        <ToolInfoBox>
          Enter positive values to calculate compound growth over time.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides an estimate only. Actual returns can vary due to
        fees, taxes, inflation, contribution timing, compounding rules and market
        risk.
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
            {formatPercent(percentage)} of final balance
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