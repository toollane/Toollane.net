"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ContributionFrequency = "monthly" | "quarterly" | "yearly";

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

function getFrequencyMultiplier(frequency: ContributionFrequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

function getFrequencyLabel(frequency: ContributionFrequency) {
  if (frequency === "monthly") return "Monthly";
  if (frequency === "quarterly") return "Quarterly";
  return "Yearly";
}

function calculateSavings({
  startingBalance,
  regularContribution,
  contributionFrequency,
  annualInterestRate,
  years,
  taxRate,
  inflationRate,
}: {
  startingBalance: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualInterestRate: number;
  years: number;
  taxRate: number;
  inflationRate: number;
}) {
  if (
    startingBalance < 0 ||
    regularContribution < 0 ||
    annualInterestRate < 0 ||
    years <= 0 ||
    taxRate < 0 ||
    taxRate > 100 ||
    inflationRate < 0
  ) {
    return null;
  }

  const periodsPerYear = getFrequencyMultiplier(contributionFrequency);
  const totalYears = Math.round(years);
  const totalPeriods = totalYears * periodsPerYear;
  const periodicRate = annualInterestRate / 100 / periodsPerYear;

  let balance = startingBalance;
  let totalContributions = startingBalance;
  let totalInterest = 0;

  const yearlyRows: YearlyRow[] = [];

  for (let period = 1; period <= totalPeriods; period++) {
    const interest = balance * periodicRate;

    totalInterest += interest;
    balance += interest + regularContribution;
    totalContributions += regularContribution;

    if (period % periodsPerYear === 0 || period === totalPeriods) {
      const year = Math.ceil(period / periodsPerYear);

      yearlyRows.push({
        year,
        balance,
        contributions: totalContributions,
        interest: totalInterest,
      });
    }
  }

  const estimatedTax = totalInterest * (taxRate / 100);
  const afterTaxBalance = balance - estimatedTax;
  const realValue =
    afterTaxBalance / Math.pow(1 + inflationRate / 100, totalYears);
  const growthOnly = balance - totalContributions;

  const contributionShare =
    balance > 0 ? Math.max(0, Math.min(100, (totalContributions / balance) * 100)) : 0;

  const interestShare =
    balance > 0 ? Math.max(0, Math.min(100, (growthOnly / balance) * 100)) : 0;

  const taxImpact =
    balance > 0 ? Math.max(0, Math.min(100, (estimatedTax / balance) * 100)) : 0;

  return {
    finalBalance: balance,
    afterTaxBalance,
    realValue,
    totalContributions,
    totalInterest,
    estimatedTax,
    growthOnly,
    totalYears,
    totalPeriods,
    contributionShare,
    interestShare,
    taxImpact,
    yearlyRows,
  };
}

export default function SavingsCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [startingBalance, setStartingBalance] = useState("5000");
  const [regularContribution, setRegularContribution] = useState("250");
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [annualInterestRate, setAnnualInterestRate] = useState("4.5");
  const [years, setYears] = useState("10");
  const [taxRate, setTaxRate] = useState("0");
  const [inflationRate, setInflationRate] = useState("2");
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      startingBalance: parseNumber(startingBalance),
      regularContribution: parseNumber(regularContribution),
      annualInterestRate: parseNumber(annualInterestRate),
      years: parseNumber(years),
      taxRate: parseNumber(taxRate),
      inflationRate: parseNumber(inflationRate),
    }),
    [
      startingBalance,
      regularContribution,
      annualInterestRate,
      years,
      taxRate,
      inflationRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateSavings({
        startingBalance: numericValues.startingBalance,
        regularContribution: numericValues.regularContribution,
        contributionFrequency,
        annualInterestRate: numericValues.annualInterestRate,
        years: numericValues.years,
        taxRate: numericValues.taxRate,
        inflationRate: numericValues.inflationRate,
      }),
    [numericValues, contributionFrequency]
  );

  function validateInputs() {
    if (
      numericValues.startingBalance < 0 ||
      numericValues.regularContribution < 0
    ) {
      setError("Starting balance and contribution cannot be negative.");
      return false;
    }

    if (
      numericValues.annualInterestRate < 0 ||
      numericValues.inflationRate < 0
    ) {
      setError("Interest rate and inflation rate cannot be negative.");
      return false;
    }

    if (numericValues.years <= 0) {
      setError("Savings period must be greater than zero.");
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
    setStartingBalance("5000");
    setRegularContribution("250");
    setContributionFrequency("monthly");
    setAnnualInterestRate("4.5");
    setYears("10");
    setTaxRate("0");
    setInflationRate("2");
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    balance,
    contribution,
    frequency,
    interest,
    duration,
    tax,
    inflation,
  }: {
    balance: string;
    contribution: string;
    frequency: ContributionFrequency;
    interest: string;
    duration: string;
    tax: string;
    inflation: string;
  }) {
    setStartingBalance(balance);
    setRegularContribution(contribution);
    setContributionFrequency(frequency);
    setAnnualInterestRate(interest);
    setYears(duration);
    setTaxRate(tax);
    setInflationRate(inflation);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate savings growth online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how your savings can grow over time with recurring
          contributions, interest, tax assumptions and inflation adjustment.
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
          label="Contribution"
          value={`${formatCurrency(
            numericValues.regularContribution,
            currency
          )} ${getFrequencyLabel(contributionFrequency).toLowerCase()}`}
        />
      </div>

      <ToolResultBox title="Savings details">
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
            label="Starting balance"
            value={startingBalance}
            onChange={setStartingBalance}
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

          <TextNumberInput
            label="Annual interest rate"
            value={annualInterestRate}
            onChange={setAnnualInterestRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Savings period"
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
                balance: "5000",
                contribution: "250",
                frequency: "monthly",
                interest: "4.5",
                duration: "10",
                tax: "0",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Standard savings
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                balance: "1000",
                contribution: "500",
                frequency: "monthly",
                interest: "4",
                duration: "3",
                tax: "0",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Emergency fund
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                balance: "10000",
                contribution: "1000",
                frequency: "quarterly",
                interest: "5",
                duration: "15",
                tax: "15",
                inflation: "2.5",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Long-term savings
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
          <ToolResultBox title="Savings estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Final balance"
                value={formatCurrency(result.finalBalance, currency)}
                highlight
              />

              <ResultCard
                label="After-tax balance"
                value={formatCurrency(result.afterTaxBalance, currency)}
              />

              <ResultCard
                label="Inflation-adjusted"
                value={formatCurrency(result.realValue, currency)}
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
                label="Growth only"
                value={formatCurrency(result.growthOnly, currency)}
              />

              <ResultCard
                label="Savings period"
                value={`${result.totalYears} years`}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              After {result.totalYears} years, your estimated savings balance is{" "}
              <strong className="text-black">
                {formatCurrency(result.finalBalance, currency)}
              </strong>
              . After tax and inflation assumptions, the estimated real value is{" "}
              <strong className="text-black">
                {formatCurrency(result.realValue, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Savings breakdown">
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
                label="Interest growth"
                percentage={result.interestShare}
                formattedValue={formatCurrency(result.growthOnly, currency)}
              />

              <BreakdownBar
                label="Estimated tax impact"
                percentage={result.taxImpact}
                formattedValue={formatCurrency(result.estimatedTax, currency)}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Yearly savings summary"
            description="Show estimated balance, contributions and interest earned by year."
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
          Enter valid savings values to calculate future growth.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This savings calculator is for estimates only. Actual results can vary
        based on account terms, taxes, fees, inflation, compounding rules and
        local regulations.
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