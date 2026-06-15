"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type YearlyRow = {
  year: number;
  futureCost: number;
  purchasingPower: number;
  incomeAdjustedAmount: number;
  incomeGap: number;
  cumulativeInflation: number;
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

function calculateInflation({
  amount,
  inflationRate,
  years,
  incomeGrowthRate,
}: {
  amount: number;
  inflationRate: number;
  years: number;
  incomeGrowthRate: number;
}) {
  if (
    amount < 0 ||
    inflationRate < 0 ||
    inflationRate > 100 ||
    years < 0 ||
    incomeGrowthRate < 0 ||
    incomeGrowthRate > 100
  ) {
    return null;
  }

  const inflationMultiplier = Math.pow(1 + inflationRate / 100, years);
  const incomeMultiplier = Math.pow(1 + incomeGrowthRate / 100, years);

  const futureCost = amount * inflationMultiplier;
  const purchasingPower =
    inflationMultiplier > 0 ? amount / inflationMultiplier : amount;
  const totalInflationImpact = futureCost - amount;
  const purchasingPowerLoss = amount - purchasingPower;
  const incomeAdjustedAmount = amount * incomeMultiplier;
  const incomeGap = incomeAdjustedAmount - futureCost;

  const cumulativeInflation =
    amount > 0 ? ((futureCost - amount) / amount) * 100 : 0;

  const totalIncomeGrowth =
    amount > 0 ? ((incomeAdjustedAmount - amount) / amount) * 100 : 0;

  const realIncomeChange =
    futureCost > 0 ? ((incomeAdjustedAmount - futureCost) / futureCost) * 100 : 0;

  const purchasingPowerRetained =
    amount > 0 ? (purchasingPower / amount) * 100 : 0;

  const requiredIncomeGrowthRate = inflationRate;

  const yearlyRows: YearlyRow[] = [];

  for (let year = 1; year <= Math.ceil(years); year += 1) {
    const elapsedYears = Math.min(year, years);
    const yearlyInflationMultiplier = Math.pow(
      1 + inflationRate / 100,
      elapsedYears
    );
    const yearlyIncomeMultiplier = Math.pow(
      1 + incomeGrowthRate / 100,
      elapsedYears
    );

    const yearlyFutureCost = amount * yearlyInflationMultiplier;
    const yearlyPurchasingPower =
      yearlyInflationMultiplier > 0
        ? amount / yearlyInflationMultiplier
        : amount;
    const yearlyIncomeAdjustedAmount = amount * yearlyIncomeMultiplier;

    yearlyRows.push({
      year,
      futureCost: yearlyFutureCost,
      purchasingPower: yearlyPurchasingPower,
      incomeAdjustedAmount: yearlyIncomeAdjustedAmount,
      incomeGap: yearlyIncomeAdjustedAmount - yearlyFutureCost,
      cumulativeInflation:
        amount > 0 ? ((yearlyFutureCost - amount) / amount) * 100 : 0,
    });
  }

  return {
    futureCost,
    purchasingPower,
    totalInflationImpact,
    purchasingPowerLoss,
    incomeAdjustedAmount,
    incomeGap,
    realIncomeChange,
    cumulativeInflation,
    totalIncomeGrowth,
    purchasingPowerRetained,
    requiredIncomeGrowthRate,
    yearlyRows,
  };
}

export default function InflationCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState("1000");
  const [inflationRate, setInflationRate] = useState("3");
  const [years, setYears] = useState("10");
  const [incomeGrowthRate, setIncomeGrowthRate] = useState("2");
  const [showYearlyProjection, setShowYearlyProjection] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      amount: parseNumber(amount),
      inflationRate: parseNumber(inflationRate),
      years: parseNumber(years),
      incomeGrowthRate: parseNumber(incomeGrowthRate),
    }),
    [amount, inflationRate, years, incomeGrowthRate]
  );

  const result = useMemo(
    () =>
      calculateInflation({
        amount: numericValues.amount,
        inflationRate: numericValues.inflationRate,
        years: numericValues.years,
        incomeGrowthRate: numericValues.incomeGrowthRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (numericValues.amount < 0 || numericValues.years < 0) {
      setError("Amount and years cannot be negative.");
      return false;
    }

    if (
      numericValues.inflationRate < 0 ||
      numericValues.inflationRate > 100 ||
      numericValues.incomeGrowthRate < 0 ||
      numericValues.incomeGrowthRate > 100
    ) {
      setError("Inflation and income growth rates must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAmount("1000");
    setInflationRate("3");
    setYears("10");
    setIncomeGrowthRate("2");
    setShowYearlyProjection(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    nextAmount,
    nextInflation,
    nextYears,
    nextIncomeGrowth,
  }: {
    nextAmount: string;
    nextInflation: string;
    nextYears: string;
    nextIncomeGrowth: string;
  }) {
    setAmount(nextAmount);
    setInflationRate(nextInflation);
    setYears(nextYears);
    setIncomeGrowthRate(nextIncomeGrowth);
    setShowYearlyProjection(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate inflation impact online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate future prices, purchasing power loss, cumulative inflation
          and whether income growth keeps up with rising costs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current amount"
          value={formatCurrency(numericValues.amount, currency)}
        />

        <StatCard
          label="Inflation rate"
          value={formatPercent(numericValues.inflationRate)}
        />

        <StatCard label="Time" value={formatYears(numericValues.years)} />
      </div>

      <ToolResultBox title="Inflation details">
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
            label="Current amount"
            value={amount}
            onChange={setAmount}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Annual inflation rate"
            value={inflationRate}
            onChange={setInflationRate}
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
            label="Annual income growth"
            value={incomeGrowthRate}
            onChange={setIncomeGrowthRate}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextAmount: "1000",
                nextInflation: "3",
                nextYears: "10",
                nextIncomeGrowth: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Moderate inflation
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextAmount: "1000",
                nextInflation: "6",
                nextYears: "10",
                nextIncomeGrowth: "3",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            High inflation
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextAmount: "50000",
                nextInflation: "3.5",
                nextYears: "15",
                nextIncomeGrowth: "4",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Salary comparison
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
          <ToolResultBox title="Inflation estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Future cost"
                value={formatCurrency(result.futureCost, currency)}
                highlight
              />

              <ResultCard
                label="Purchasing power"
                value={formatCurrency(result.purchasingPower, currency)}
              />

              <ResultCard
                label="Purchasing power loss"
                value={formatCurrency(result.purchasingPowerLoss, currency)}
              />

              <ResultCard
                label="Cumulative inflation"
                value={formatPercent(result.cumulativeInflation)}
              />

              <ResultCard
                label="Income-adjusted amount"
                value={formatCurrency(result.incomeAdjustedAmount, currency)}
              />

              <ResultCard
                label="Income gap"
                value={formatCurrency(result.incomeGap, currency)}
              />

              <ResultCard
                label="Real income change"
                value={formatPercent(result.realIncomeChange)}
              />

              <ResultCard
                label="Required income growth"
                value={formatPercent(result.requiredIncomeGrowthRate)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              An item that costs{" "}
              <strong className="text-black">
                {formatCurrency(numericValues.amount, currency)}
              </strong>{" "}
              today may cost about{" "}
              <strong className="text-black">
                {formatCurrency(result.futureCost, currency)}
              </strong>{" "}
              after {formatYears(numericValues.years)}. The estimated
              purchasing power of the original amount falls to{" "}
              <strong className="text-black">
                {formatCurrency(result.purchasingPower, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Inflation and income breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Cumulative inflation"
                percentage={result.cumulativeInflation}
                formattedValue={formatCurrency(
                  result.totalInflationImpact,
                  currency
                )}
              />

              <BreakdownBar
                label="Purchasing power retained"
                percentage={result.purchasingPowerRetained}
                formattedValue={formatCurrency(result.purchasingPower, currency)}
              />

              <BreakdownBar
                label="Total income growth"
                percentage={result.totalIncomeGrowth}
                formattedValue={formatCurrency(
                  result.incomeAdjustedAmount,
                  currency
                )}
              />

              <BreakdownBar
                label="Real income change"
                percentage={result.realIncomeChange}
                formattedValue={formatCurrency(result.incomeGap, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Yearly inflation projection"
              description="Show future cost, purchasing power and income-adjusted amount by year."
              open={showYearlyProjection}
              onToggle={() => setShowYearlyProjection((current) => !current)}
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
                          Cumulative inflation{" "}
                          {formatPercent(row.cumulativeInflation)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-black">
                          {formatCurrency(row.futureCost, currency)}
                        </div>

                        <div className="mt-1 text-xs font-bold text-black/45">
                          Future cost
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">
                          Purchasing power
                        </div>

                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.purchasingPower, currency)}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#fff8df] p-3">
                        <div className="font-bold text-black/45">
                          Income gap
                        </div>

                        <div className="mt-1 font-black text-black">
                          {formatCurrency(row.incomeGap, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TogglePanel>

            <TogglePanel
              title="Inflation formula details"
              description="Show how future cost, purchasing power and income comparison are estimated."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="Future cost"
                  text="Future cost = current amount × (1 + inflation rate) ^ years."
                />

                <FormulaCard
                  title="Purchasing power"
                  text="Purchasing power = current amount ÷ (1 + inflation rate) ^ years."
                />

                <FormulaCard
                  title="Income-adjusted amount"
                  text="Income-adjusted amount = current amount × (1 + income growth rate) ^ years."
                />

                <FormulaCard
                  title="Real income change"
                  text="Real income change compares income growth with the future inflated cost."
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid inflation assumptions to calculate future cost and
          purchasing power.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator uses a constant annual inflation rate for estimates.
        Actual inflation varies over time and differs by country, category and
        personal spending pattern.
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