"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

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

function formatMonths(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "Not reached";

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value)} months`;
}

function calculateRoi({
  initialInvestment,
  additionalCosts,
  revenue,
  ongoingCosts,
  timeMonths,
  taxRate,
}: {
  initialInvestment: number;
  additionalCosts: number;
  revenue: number;
  ongoingCosts: number;
  timeMonths: number;
  taxRate: number;
}) {
  if (
    initialInvestment < 0 ||
    additionalCosts < 0 ||
    revenue < 0 ||
    ongoingCosts < 0 ||
    timeMonths <= 0 ||
    taxRate < 0 ||
    taxRate > 100
  ) {
    return null;
  }

  const totalInvestment = initialInvestment + additionalCosts + ongoingCosts;
  const grossProfit = revenue - totalInvestment;
  const estimatedTax = grossProfit > 0 ? grossProfit * (taxRate / 100) : 0;
  const netProfit = grossProfit - estimatedTax;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const grossRoi =
    totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
  const annualizedRoi =
    timeMonths > 0 && roi > -100
      ? (Math.pow(1 + roi / 100, 12 / timeMonths) - 1) * 100
      : -100;
  const monthlyNetProfit = netProfit / timeMonths;
  const monthlyGrossProfit = grossProfit / timeMonths;
  const paybackMonths =
    monthlyGrossProfit > 0 ? totalInvestment / monthlyGrossProfit : null;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const costRatio = revenue > 0 ? (totalInvestment / revenue) * 100 : 0;
  const revenueMultiple =
    totalInvestment > 0 ? revenue / totalInvestment : 0;
  const breakEvenRevenue = totalInvestment;
  const revenueGapToBreakEven = revenue - breakEvenRevenue;

  return {
    totalInvestment,
    grossProfit,
    netProfit,
    estimatedTax,
    roi,
    grossRoi,
    annualizedRoi,
    monthlyNetProfit,
    monthlyGrossProfit,
    paybackMonths,
    profitMargin,
    costRatio,
    revenueMultiple,
    breakEvenRevenue,
    revenueGapToBreakEven,
  };
}

export default function RoiCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [additionalCosts, setAdditionalCosts] = useState("1500");
  const [revenue, setRevenue] = useState("18000");
  const [ongoingCosts, setOngoingCosts] = useState("3000");
  const [timeMonths, setTimeMonths] = useState("12");
  const [taxRate, setTaxRate] = useState("0");
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      initialInvestment: parseNumber(initialInvestment),
      additionalCosts: parseNumber(additionalCosts),
      revenue: parseNumber(revenue),
      ongoingCosts: parseNumber(ongoingCosts),
      timeMonths: parseNumber(timeMonths),
      taxRate: parseNumber(taxRate),
    }),
    [
      initialInvestment,
      additionalCosts,
      revenue,
      ongoingCosts,
      timeMonths,
      taxRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateRoi({
        initialInvestment: numericValues.initialInvestment,
        additionalCosts: numericValues.additionalCosts,
        revenue: numericValues.revenue,
        ongoingCosts: numericValues.ongoingCosts,
        timeMonths: numericValues.timeMonths,
        taxRate: numericValues.taxRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (
      numericValues.initialInvestment < 0 ||
      numericValues.additionalCosts < 0 ||
      numericValues.revenue < 0 ||
      numericValues.ongoingCosts < 0
    ) {
      setError("Investment, revenue and cost values cannot be negative.");
      return false;
    }

    if (numericValues.timeMonths <= 0) {
      setError("Time period must be greater than zero.");
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
    setAdditionalCosts("1500");
    setRevenue("18000");
    setOngoingCosts("3000");
    setTimeMonths("12");
    setTaxRate("0");
    setShowAdvancedMetrics(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    investment,
    setup,
    totalRevenue,
    costs,
    months,
    taxes,
  }: {
    investment: string;
    setup: string;
    totalRevenue: string;
    costs: string;
    months: string;
    taxes: string;
  }) {
    setInitialInvestment(investment);
    setAdditionalCosts(setup);
    setRevenue(totalRevenue);
    setOngoingCosts(costs);
    setTimeMonths(months);
    setTaxRate(taxes);
    setShowAdvancedMetrics(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate ROI online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate return on investment with revenue, initial investment, setup
          costs, ongoing costs, taxes and payback period.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="ROI" value={result ? formatPercent(result.roi) : "0%"} />
        <StatCard
          label="Net profit"
          value={result ? formatCurrency(result.netProfit, currency) : "—"}
        />
        <StatCard
          label="Payback"
          value={result ? formatMonths(result.paybackMonths) : "—"}
        />
      </div>

      <ToolResultBox title="ROI details">
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
            label="Additional setup costs"
            value={additionalCosts}
            onChange={setAdditionalCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Total revenue"
            value={revenue}
            onChange={setRevenue}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Ongoing costs"
            value={ongoingCosts}
            onChange={setOngoingCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Time period"
            value={timeMonths}
            onChange={setTimeMonths}
            onBlur={validateInputs}
            suffix="months"
          />

          <TextNumberInput
            label="Tax rate on profit"
            value={taxRate}
            onChange={setTaxRate}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                investment: "10000",
                setup: "1500",
                totalRevenue: "18000",
                costs: "3000",
                months: "12",
                taxes: "0",
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
                investment: "5000",
                setup: "500",
                totalRevenue: "14000",
                costs: "3000",
                months: "6",
                taxes: "0",
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
                investment: "25000",
                setup: "2500",
                totalRevenue: "42000",
                costs: "8500",
                months: "18",
                taxes: "20",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Startup investment
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
          <ToolResultBox title="ROI result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label="ROI" value={formatPercent(result.roi)} highlight />

              <ResultCard
                label="Net profit"
                value={formatCurrency(result.netProfit, currency)}
              />

              <ResultCard
                label="Total investment"
                value={formatCurrency(result.totalInvestment, currency)}
              />

              <ResultCard
                label="Annualized ROI"
                value={formatPercent(result.annualizedRoi)}
              />

              <ResultCard
                label="Profit margin"
                value={formatPercent(result.profitMargin)}
              />

              <ResultCard
                label="Estimated payback"
                value={formatMonths(result.paybackMonths)}
              />

              <ResultCard
                label="Revenue multiple"
                value={`${result.revenueMultiple.toFixed(2)}x`}
              />

              <ResultCard
                label="Monthly net profit"
                value={formatCurrency(result.monthlyNetProfit, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Your estimated ROI is{" "}
              <strong className="text-black">{formatPercent(result.roi)}</strong>{" "}
              with a net profit of{" "}
              <strong className="text-black">
                {formatCurrency(result.netProfit, currency)}
              </strong>
              . Estimated payback time is{" "}
              <strong className="text-black">
                {formatMonths(result.paybackMonths)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Investment breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Initial investment"
                percentage={
                  result.totalInvestment > 0
                    ? (numericValues.initialInvestment / result.totalInvestment) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.initialInvestment,
                  currency
                )}
              />

              <BreakdownBar
                label="Setup costs"
                percentage={
                  result.totalInvestment > 0
                    ? (numericValues.additionalCosts / result.totalInvestment) *
                      100
                    : 0
                }
                formattedValue={formatCurrency(
                  numericValues.additionalCosts,
                  currency
                )}
              />

              <BreakdownBar
                label="Ongoing costs"
                percentage={
                  result.totalInvestment > 0
                    ? (numericValues.ongoingCosts / result.totalInvestment) * 100
                    : 0
                }
                formattedValue={formatCurrency(numericValues.ongoingCosts, currency)}
              />

              <BreakdownBar
                label="Net profit vs investment"
                percentage={Math.max(0, result.roi)}
                formattedValue={formatCurrency(result.netProfit, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Advanced ROI metrics"
              description="Show gross ROI, cost ratio, break-even revenue and revenue gap."
              open={showAdvancedMetrics}
              onToggle={() => setShowAdvancedMetrics((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Gross ROI"
                  value={formatPercent(result.grossRoi)}
                />
                <ResultCard
                  label="Gross profit"
                  value={formatCurrency(result.grossProfit, currency)}
                />
                <ResultCard
                  label="Estimated tax"
                  value={formatCurrency(result.estimatedTax, currency)}
                />
                <ResultCard
                  label="Cost ratio"
                  value={formatPercent(result.costRatio)}
                />
                <ResultCard
                  label="Break-even revenue"
                  value={formatCurrency(result.breakEvenRevenue, currency)}
                />
                <ResultCard
                  label="Revenue above break-even"
                  value={formatCurrency(result.revenueGapToBreakEven, currency)}
                />
              </div>
            </TogglePanel>

            <TogglePanel
              title="ROI formula details"
              description="Show the formulas used to calculate ROI, annualized ROI and payback period."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="ROI formula"
                  text="ROI = Net profit ÷ Total investment × 100"
                />

                <FormulaCard
                  title="Net profit"
                  text="Net profit = Revenue - Total investment - Estimated tax"
                />

                <FormulaCard
                  title="Annualized ROI"
                  text="Annualized ROI estimates the yearly return based on the selected time period."
                />

                <FormulaCard
                  title="Payback period"
                  text="Payback period estimates how many months it takes to recover the total investment."
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid investment and revenue values to calculate ROI.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        ROI is useful for comparing investments, campaigns and projects, but it
        does not fully account for risk, cash flow timing, taxes, opportunity
        cost, financing costs or long-term uncertainty.
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