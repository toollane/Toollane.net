"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type ProjectionRow = {
  month: number;
  revenue: number;
  operatingCosts: number;
  cashFlow: number;
  discountedCashFlow: number;
  cumulativeCashFlow: number;
  cumulativeDiscountedCashFlow: number;
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

function formatMonths(months: number | null) {
  if (months === null) return "Not reached";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years <= 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }

  return `${years} year${years === 1 ? "" : "s"}, ${remainingMonths} month${
    remainingMonths === 1 ? "" : "s"
  }`;
}

function calculatePaybackPeriod({
  initialInvestment,
  monthlyRevenue,
  monthlyOperatingCosts,
  monthlyGrowthRate,
  discountRate,
}: {
  initialInvestment: number;
  monthlyRevenue: number;
  monthlyOperatingCosts: number;
  monthlyGrowthRate: number;
  discountRate: number;
}) {
  if (
    initialInvestment <= 0 ||
    monthlyRevenue < 0 ||
    monthlyOperatingCosts < 0 ||
    monthlyGrowthRate < 0 ||
    monthlyGrowthRate > 100 ||
    discountRate < 0 ||
    discountRate > 100
  ) {
    return null;
  }

  let cumulativeCashFlow = 0;
  let cumulativeDiscountedCashFlow = 0;
  let paybackMonth: number | null = null;
  let discountedPaybackMonth: number | null = null;
  let currentRevenue = monthlyRevenue;

  const monthlyDiscountRate = discountRate / 100 / 12;
  const monthlyGrowthMultiplier = 1 + monthlyGrowthRate / 100;
  const projection: ProjectionRow[] = [];

  for (let month = 1; month <= 600; month += 1) {
    const cashFlow = currentRevenue - monthlyOperatingCosts;
    const discountedCashFlow =
      cashFlow / Math.pow(1 + monthlyDiscountRate, month);

    cumulativeCashFlow += cashFlow;
    cumulativeDiscountedCashFlow += discountedCashFlow;

    if (paybackMonth === null && cumulativeCashFlow >= initialInvestment) {
      paybackMonth = month;
    }

    if (
      discountedPaybackMonth === null &&
      cumulativeDiscountedCashFlow >= initialInvestment
    ) {
      discountedPaybackMonth = month;
    }

    projection.push({
      month,
      revenue: currentRevenue,
      operatingCosts: monthlyOperatingCosts,
      cashFlow,
      discountedCashFlow,
      cumulativeCashFlow,
      cumulativeDiscountedCashFlow,
    });

    currentRevenue *= monthlyGrowthMultiplier;
  }

  const firstMonthCashFlow = monthlyRevenue - monthlyOperatingCosts;
  const firstYearRows = projection.slice(0, 12);
  const fiveYearRows = projection.slice(0, 60);

  const firstYearCashFlow = firstYearRows.reduce(
    (total, row) => total + row.cashFlow,
    0
  );

  const firstYearDiscountedCashFlow = firstYearRows.reduce(
    (total, row) => total + row.discountedCashFlow,
    0
  );

  const fiveYearCashFlow = fiveYearRows.reduce(
    (total, row) => total + row.cashFlow,
    0
  );

  const fiveYearDiscountedCashFlow = fiveYearRows.reduce(
    (total, row) => total + row.discountedCashFlow,
    0
  );

  const roiAfterOneYear =
    initialInvestment > 0
      ? ((firstYearCashFlow - initialInvestment) / initialInvestment) * 100
      : 0;

  const fiveYearNetReturn = fiveYearCashFlow - initialInvestment;
  const fiveYearDiscountedNetReturn =
    fiveYearDiscountedCashFlow - initialInvestment;

  const firstYearRecoveryRate =
    initialInvestment > 0 ? (firstYearCashFlow / initialInvestment) * 100 : 0;

  const firstMonthCashFlowMargin =
    monthlyRevenue > 0 ? (firstMonthCashFlow / monthlyRevenue) * 100 : 0;

  const annualizedGrowthRate =
    (Math.pow(1 + monthlyGrowthRate / 100, 12) - 1) * 100;

  return {
    monthlyNetCashFlow: firstMonthCashFlow,
    firstYearCashFlow,
    firstYearDiscountedCashFlow,
    fiveYearCashFlow,
    fiveYearDiscountedCashFlow,
    fiveYearNetReturn,
    fiveYearDiscountedNetReturn,
    paybackMonth,
    discountedPaybackMonth,
    roiAfterOneYear,
    firstYearRecoveryRate,
    firstMonthCashFlowMargin,
    annualizedGrowthRate,
    projection,
  };
}

export default function PaybackPeriodCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [initialInvestment, setInitialInvestment] = useState("25000");
  const [monthlyRevenue, setMonthlyRevenue] = useState("5000");
  const [monthlyOperatingCosts, setMonthlyOperatingCosts] = useState("2200");
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState("3");
  const [discountRate, setDiscountRate] = useState("8");
  const [showMonthlyProjection, setShowMonthlyProjection] = useState(false);
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      initialInvestment: parseNumber(initialInvestment),
      monthlyRevenue: parseNumber(monthlyRevenue),
      monthlyOperatingCosts: parseNumber(monthlyOperatingCosts),
      monthlyGrowthRate: parseNumber(monthlyGrowthRate),
      discountRate: parseNumber(discountRate),
    }),
    [
      initialInvestment,
      monthlyRevenue,
      monthlyOperatingCosts,
      monthlyGrowthRate,
      discountRate,
    ]
  );

  const result = useMemo(
    () =>
      calculatePaybackPeriod({
        initialInvestment: numericValues.initialInvestment,
        monthlyRevenue: numericValues.monthlyRevenue,
        monthlyOperatingCosts: numericValues.monthlyOperatingCosts,
        monthlyGrowthRate: numericValues.monthlyGrowthRate,
        discountRate: numericValues.discountRate,
      }),
    [numericValues]
  );

  const monthlyProjectionRows = useMemo(() => {
    if (!result) return [];

    return result.projection.slice(0, 24);
  }, [result]);

  const yearlyRows = useMemo(() => {
    if (!result) return [];

    const highlightedMonths = new Set<number>();

    result.projection.forEach((row) => {
      if (row.month % 12 === 0 && row.month <= 120) {
        highlightedMonths.add(row.month);
      }
    });

    if (result.paybackMonth !== null) {
      highlightedMonths.add(result.paybackMonth);
    }

    if (result.discountedPaybackMonth !== null) {
      highlightedMonths.add(result.discountedPaybackMonth);
    }

    return result.projection.filter((row) => highlightedMonths.has(row.month));
  }, [result]);

  function validateInputs() {
    if (numericValues.initialInvestment <= 0) {
      setError("Initial investment must be greater than zero.");
      return false;
    }

    if (
      numericValues.monthlyRevenue < 0 ||
      numericValues.monthlyOperatingCosts < 0
    ) {
      setError("Revenue and operating costs cannot be negative.");
      return false;
    }

    if (
      numericValues.monthlyGrowthRate < 0 ||
      numericValues.monthlyGrowthRate > 100 ||
      numericValues.discountRate < 0 ||
      numericValues.discountRate > 100
    ) {
      setError("Growth and discount rates must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setInitialInvestment("25000");
    setMonthlyRevenue("5000");
    setMonthlyOperatingCosts("2200");
    setMonthlyGrowthRate("3");
    setDiscountRate("8");
    setShowMonthlyProjection(false);
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    nextInvestment,
    nextRevenue,
    nextCosts,
    nextGrowth,
    nextDiscount,
  }: {
    nextInvestment: string;
    nextRevenue: string;
    nextCosts: string;
    nextGrowth: string;
    nextDiscount: string;
  }) {
    setInitialInvestment(nextInvestment);
    setMonthlyRevenue(nextRevenue);
    setMonthlyOperatingCosts(nextCosts);
    setMonthlyGrowthRate(nextGrowth);
    setDiscountRate(nextDiscount);
    setShowMonthlyProjection(false);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate payback period online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how long it takes to recover an investment using monthly cash
          flow, revenue growth and discounted payback assumptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Initial investment"
          value={formatCurrency(numericValues.initialInvestment, currency)}
        />

        <StatCard
          label="Monthly cash flow"
          value={
            result
              ? formatCurrency(result.monthlyNetCashFlow, currency)
              : formatCurrency(0, currency)
          }
        />

        <StatCard
          label="Monthly growth"
          value={formatPercent(numericValues.monthlyGrowthRate)}
        />
      </div>

      <ToolResultBox title="Investment and cash flow details">
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
            label="Monthly revenue"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly operating costs"
            value={monthlyOperatingCosts}
            onChange={setMonthlyOperatingCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly revenue growth"
            value={monthlyGrowthRate}
            onChange={setMonthlyGrowthRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Annual discount rate"
            value={discountRate}
            onChange={setDiscountRate}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextInvestment: "25000",
                nextRevenue: "5000",
                nextCosts: "2200",
                nextGrowth: "3",
                nextDiscount: "8",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Business project
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextInvestment: "12000",
                nextRevenue: "3200",
                nextCosts: "1600",
                nextGrowth: "2",
                nextDiscount: "8",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Marketing campaign
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextInvestment: "60000",
                nextRevenue: "9000",
                nextCosts: "5200",
                nextGrowth: "4",
                nextDiscount: "10",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Expansion plan
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
          <ToolResultBox title="Payback period estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Payback period"
                value={formatMonths(result.paybackMonth)}
                highlight
              />

              <ResultCard
                label="Discounted payback"
                value={formatMonths(result.discountedPaybackMonth)}
              />

              <ResultCard
                label="Monthly net cash flow"
                value={formatCurrency(result.monthlyNetCashFlow, currency)}
              />

              <ResultCard
                label="Year 1 cash flow"
                value={formatCurrency(result.firstYearCashFlow, currency)}
              />

              <ResultCard
                label="Year 1 ROI"
                value={formatPercent(result.roiAfterOneYear)}
              />

              <ResultCard
                label="First-year recovery"
                value={formatPercent(result.firstYearRecoveryRate)}
              />

              <ResultCard
                label="5-year net return"
                value={formatCurrency(result.fiveYearNetReturn, currency)}
              />

              <ResultCard
                label="Annualized growth"
                value={formatPercent(result.annualizedGrowthRate)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated payback period:{" "}
              <strong className="text-black">
                {formatMonths(result.paybackMonth)}
              </strong>
              . Discounted payback period:{" "}
              <strong className="text-black">
                {formatMonths(result.discountedPaybackMonth)}
              </strong>
              . First-year cash flow:{" "}
              <strong className="text-black">
                {formatCurrency(result.firstYearCashFlow, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Cash flow breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Monthly net cash flow margin"
                percentage={result.firstMonthCashFlowMargin}
                formattedValue={formatCurrency(
                  result.monthlyNetCashFlow,
                  currency
                )}
              />

              <BreakdownBar
                label="First-year investment recovery"
                percentage={result.firstYearRecoveryRate}
                formattedValue={formatCurrency(
                  result.firstYearCashFlow,
                  currency
                )}
              />

              <BreakdownBar
                label="Operating cost ratio"
                percentage={
                  numericValues.monthlyRevenue > 0
                    ? (numericValues.monthlyOperatingCosts /
                        numericValues.monthlyRevenue) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.monthlyOperatingCosts,
                  currency
                )}
              />

              <BreakdownBar
                label="Discounted year 1 cash flow"
                percentage={
                  numericValues.initialInvestment > 0
                    ? (result.firstYearDiscountedCashFlow /
                        numericValues.initialInvestment) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  result.firstYearDiscountedCashFlow,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Monthly projection"
              description="Show the first 24 months of revenue, cash flow and cumulative recovery."
              open={showMonthlyProjection}
              onToggle={() => setShowMonthlyProjection((current) => !current)}
            >
              <div className="grid gap-3 sm:hidden">
                {monthlyProjectionRows.map((row) => (
                  <ProjectionCard
                    key={row.month}
                    row={row}
                    currency={currency}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-2xl border border-black/10 bg-white sm:block">
                <div className="min-w-[860px]">
                  <div className="grid grid-cols-6 gap-3 border-b border-black/10 bg-[#fff8df] px-4 py-3 text-xs font-black uppercase tracking-wide text-black/50">
                    <div>Month</div>
                    <div>Revenue</div>
                    <div>Costs</div>
                    <div>Cash flow</div>
                    <div>Discounted</div>
                    <div>Cumulative</div>
                  </div>

                  {monthlyProjectionRows.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-6 gap-3 border-b border-black/5 px-4 py-3 text-xs text-black/65 last:border-b-0"
                    >
                      <div className="font-bold text-black">{row.month}</div>
                      <div>{formatCurrency(row.revenue, currency)}</div>
                      <div>{formatCurrency(row.operatingCosts, currency)}</div>
                      <div>{formatCurrency(row.cashFlow, currency)}</div>
                      <div>
                        {formatCurrency(row.discountedCashFlow, currency)}
                      </div>
                      <div>
                        {formatCurrency(row.cumulativeCashFlow, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TogglePanel>

            <TogglePanel
              title="Yearly recovery summary"
              description="Show yearly cumulative cash flow and important payback milestones."
              open={showYearlySummary}
              onToggle={() => setShowYearlySummary((current) => !current)}
            >
              <div className="grid gap-3">
                {yearlyRows.map((row) => {
                  const recoveryRate =
                    numericValues.initialInvestment > 0
                      ? (row.cumulativeCashFlow /
                          numericValues.initialInvestment) *
                        100
                      : 0;

                  return (
                    <div
                      key={row.month}
                      className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-black text-black">
                            Month {row.month}
                          </div>

                          <div className="mt-1 text-xs text-black/50">
                            Cumulative recovery
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-black">
                            {formatCurrency(row.cumulativeCashFlow, currency)}
                          </div>

                          <div className="mt-1 text-xs font-bold text-black/45">
                            {formatPercent(recoveryRate)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, recoveryRate)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid investment and cash flow values to calculate the payback
          period.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        The payback period shows how long it takes to recover an initial
        investment. Discounted payback also considers the time value of money.
        This calculator provides estimates only and should not be treated as
        financial advice.
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

function ProjectionCard({
  row,
  currency,
}: {
  row: ProjectionRow;
  currency: CurrencyCode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">
            Month {row.month}
          </div>

          <div className="mt-1 text-xs text-black/50">
            Revenue {formatCurrency(row.revenue, currency)}
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formatCurrency(row.cumulativeCashFlow, currency)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-[#fff8df] p-3">
          <div className="font-bold text-black/45">Cash flow</div>

          <div className="mt-1 font-black text-black">
            {formatCurrency(row.cashFlow, currency)}
          </div>
        </div>

        <div className="rounded-xl bg-[#fff8df] p-3">
          <div className="font-bold text-black/45">Discounted</div>

          <div className="mt-1 font-black text-black">
            {formatCurrency(row.discountedCashFlow, currency)}
          </div>
        </div>
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