"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ContributionFrequency = "monthly" | "quarterly" | "yearly";

type YearlyRow = {
  year: number;
  balance: number;
  contributions: number;
  gain: number;
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

function getPeriodsPerYear(frequency: ContributionFrequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

function getFrequencyLabel(frequency: ContributionFrequency) {
  if (frequency === "monthly") return "Monthly";
  if (frequency === "quarterly") return "Quarterly";
  return "Yearly";
}

function calculateFeeImpact({
  initialInvestment,
  regularContribution,
  contributionFrequency,
  annualReturn,
  years,
  expenseRatio,
}: {
  initialInvestment: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualReturn: number;
  years: number;
  expenseRatio: number;
}) {
  const periodsPerYear = getPeriodsPerYear(contributionFrequency);
  const totalPeriods = years * periodsPerYear;
  const grossPeriodicRate = annualReturn / 100 / periodsPerYear;
  const netPeriodicRate =
    Math.max(0, annualReturn - expenseRatio) / 100 / periodsPerYear;

  let grossBalance = initialInvestment;
  let netBalance = initialInvestment;

  for (let period = 1; period <= totalPeriods; period++) {
    grossBalance = grossBalance * (1 + grossPeriodicRate) + regularContribution;
    netBalance = netBalance * (1 + netPeriodicRate) + regularContribution;
  }

  return Math.max(0, grossBalance - netBalance);
}

function calculateInvestment({
  initialInvestment,
  regularContribution,
  contributionFrequency,
  annualReturn,
  years,
  expenseRatio,
  taxRate,
  inflationRate,
}: {
  initialInvestment: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualReturn: number;
  years: number;
  expenseRatio: number;
  taxRate: number;
  inflationRate: number;
}) {
  if (
    initialInvestment < 0 ||
    regularContribution < 0 ||
    annualReturn < 0 ||
    years <= 0 ||
    expenseRatio < 0 ||
    taxRate < 0 ||
    taxRate > 100 ||
    inflationRate < 0
  ) {
    return null;
  }

  const periodsPerYear = getPeriodsPerYear(contributionFrequency);
  const totalYears = Math.round(years);
  const totalPeriods = totalYears * periodsPerYear;
  const netAnnualReturn = Math.max(0, annualReturn - expenseRatio);
  const periodicRate = netAnnualReturn / 100 / periodsPerYear;

  let balance = initialInvestment;
  let totalContributions = initialInvestment;

  const yearlyRows: YearlyRow[] = [];

  for (let period = 1; period <= totalPeriods; period++) {
    balance = balance * (1 + periodicRate) + regularContribution;
    totalContributions += regularContribution;

    if (period % periodsPerYear === 0 || period === totalPeriods) {
      const year = Math.ceil(period / periodsPerYear);

      yearlyRows.push({
        year,
        balance,
        contributions: totalContributions,
        gain: balance - totalContributions,
      });
    }
  }

  const investmentGain = balance - totalContributions;
  const estimatedTax =
    investmentGain > 0 ? investmentGain * (taxRate / 100) : 0;
  const afterTaxValue = balance - estimatedTax;
  const inflationAdjustedValue =
    afterTaxValue / Math.pow(1 + inflationRate / 100, totalYears);

  const totalFeesImpact = calculateFeeImpact({
    initialInvestment,
    regularContribution,
    contributionFrequency,
    annualReturn,
    years: totalYears,
    expenseRatio,
  });

  const contributionShare =
    balance > 0
      ? Math.max(0, Math.min(100, (totalContributions / balance) * 100))
      : 0;

  const growthShare =
    balance > 0
      ? Math.max(0, Math.min(100, (investmentGain / balance) * 100))
      : 0;

  return {
    finalValue: balance,
    afterTaxValue,
    inflationAdjustedValue,
    totalContributions,
    investmentGain,
    estimatedTax,
    netAnnualReturn,
    totalYears,
    totalPeriods,
    totalFeesImpact,
    contributionShare,
    growthShare,
    yearlyRows,
  };
}

export default function InvestmentCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [regularContribution, setRegularContribution] = useState("300");
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [years, setYears] = useState("20");
  const [expenseRatio, setExpenseRatio] = useState("0.2");
  const [taxRate, setTaxRate] = useState("0");
  const [inflationRate, setInflationRate] = useState("2");
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      initialInvestment: parseNumber(initialInvestment),
      regularContribution: parseNumber(regularContribution),
      annualReturn: parseNumber(annualReturn),
      years: parseNumber(years),
      expenseRatio: parseNumber(expenseRatio),
      taxRate: parseNumber(taxRate),
      inflationRate: parseNumber(inflationRate),
    }),
    [
      initialInvestment,
      regularContribution,
      annualReturn,
      years,
      expenseRatio,
      taxRate,
      inflationRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateInvestment({
        initialInvestment: numericValues.initialInvestment,
        regularContribution: numericValues.regularContribution,
        contributionFrequency,
        annualReturn: numericValues.annualReturn,
        years: numericValues.years,
        expenseRatio: numericValues.expenseRatio,
        taxRate: numericValues.taxRate,
        inflationRate: numericValues.inflationRate,
      }),
    [numericValues, contributionFrequency]
  );

  function validateInputs() {
    if (
      numericValues.initialInvestment < 0 ||
      numericValues.regularContribution < 0
    ) {
      setError("Investment and contribution values cannot be negative.");
      return false;
    }

    if (
      numericValues.annualReturn < 0 ||
      numericValues.expenseRatio < 0 ||
      numericValues.inflationRate < 0
    ) {
      setError("Return, fees and inflation cannot be negative.");
      return false;
    }

    if (numericValues.years <= 0) {
      setError("Investment period must be greater than zero.");
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
    setInitialInvestment("10000");
    setRegularContribution("300");
    setContributionFrequency("monthly");
    setAnnualReturn("7");
    setYears("20");
    setExpenseRatio("0.2");
    setTaxRate("0");
    setInflationRate("2");
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    initial,
    contribution,
    frequency,
    returnRate,
    duration,
    fees,
    tax,
    inflation,
  }: {
    initial: string;
    contribution: string;
    frequency: ContributionFrequency;
    returnRate: string;
    duration: string;
    fees: string;
    tax: string;
    inflation: string;
  }) {
    setInitialInvestment(initial);
    setRegularContribution(contribution);
    setContributionFrequency(frequency);
    setAnnualReturn(returnRate);
    setYears(duration);
    setExpenseRatio(fees);
    setTaxRate(tax);
    setInflationRate(inflation);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate investment growth online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate long-term portfolio growth with starting balance, recurring
          contributions, expected return, fees, taxes and inflation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Initial investment"
          value={formatCurrency(numericValues.initialInvestment, currency)}
        />
        <StatCard
          label="Contribution"
          value={`${formatCurrency(
            numericValues.regularContribution,
            currency
          )} ${getFrequencyLabel(contributionFrequency).toLowerCase()}`}
        />
        <StatCard
          label="Net return"
          value={result ? formatPercent(result.netAnnualReturn) : "0%"}
        />
      </div>

      <ToolResultBox title="Investment details">
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
            label="Initial investment"
            value={initialInvestment}
            onChange={setInitialInvestment}
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
            label="Expected annual return"
            value={annualReturn}
            onChange={setAnnualReturn}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Investment period"
            value={years}
            onChange={setYears}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Annual fees / expense ratio"
            value={expenseRatio}
            onChange={setExpenseRatio}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Tax rate on gains"
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
                contribution: "300",
                frequency: "monthly",
                returnRate: "7",
                duration: "20",
                fees: "0.2",
                tax: "0",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Long-term portfolio
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                initial: "5000",
                contribution: "500",
                frequency: "monthly",
                returnRate: "8",
                duration: "30",
                fees: "0.15",
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
                initial: "25000",
                contribution: "1000",
                frequency: "quarterly",
                returnRate: "5",
                duration: "10",
                fees: "0.4",
                tax: "20",
                inflation: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Conservative growth
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
          <ToolResultBox title="Investment estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Final value"
                value={formatCurrency(result.finalValue, currency)}
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
                label="Investment gain"
                value={formatCurrency(result.investmentGain, currency)}
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
                label="Estimated fee impact"
                value={formatCurrency(result.totalFeesImpact, currency)}
              />

              <ResultCard
                label="Investment period"
                value={`${result.totalYears} years`}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              After {result.totalYears} years, your estimated portfolio value is{" "}
              <strong className="text-black">
                {formatCurrency(result.finalValue, currency)}
              </strong>
              . After tax and inflation assumptions, the estimated real value is{" "}
              <strong className="text-black">
                {formatCurrency(result.inflationAdjustedValue, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Portfolio breakdown">
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
                label="Investment growth"
                percentage={result.growthShare}
                formattedValue={formatCurrency(result.investmentGain, currency)}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Yearly growth summary"
            description="Show estimated portfolio value, contributions and growth by year."
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
                        {formatCurrency(row.contributions, currency)} · Growth:{" "}
                        {formatCurrency(row.gain, currency)}
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
                          Math.min(100, (row.balance / result.finalValue) * 100)
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
          Enter valid investment details to calculate projected growth.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual investment results can
        vary due to market performance, taxes, inflation, fees, contribution
        timing and currency changes.
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
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {percentage.toFixed(1)}% of final value
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
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
  children: React.ReactNode;
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