"use client";

import { useMemo, useState } from "react";

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

function calculateProfit({
  revenue,
  costOfGoodsSold,
  operatingExpenses,
  marketingCosts,
  transactionFees,
  taxRate,
}: {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  marketingCosts: number;
  transactionFees: number;
  taxRate: number;
}) {
  if (
    revenue < 0 ||
    costOfGoodsSold < 0 ||
    operatingExpenses < 0 ||
    marketingCosts < 0 ||
    transactionFees < 0 ||
    taxRate < 0 ||
    taxRate > 100
  ) {
    return null;
  }

  const transactionFeeAmount = revenue * (transactionFees / 100);
  const grossProfit = revenue - costOfGoodsSold;
  const operatingProfit =
    grossProfit - operatingExpenses - marketingCosts - transactionFeeAmount;
  const preTaxProfit = operatingProfit;
  const estimatedTax = preTaxProfit > 0 ? preTaxProfit * (taxRate / 100) : 0;
  const netProfit = preTaxProfit - estimatedTax;

  const totalExpenses =
    costOfGoodsSold + operatingExpenses + marketingCosts + transactionFeeAmount;
  const totalCostsAfterTax = totalExpenses + estimatedTax;
  const retainedRevenue = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    grossProfit,
    operatingProfit,
    preTaxProfit,
    estimatedTax,
    netProfit,
    totalExpenses,
    totalCostsAfterTax,
    transactionFeeAmount,
    grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
    operatingMargin: revenue > 0 ? (operatingProfit / revenue) * 100 : 0,
    netMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
    expenseRatio: revenue > 0 ? (totalExpenses / revenue) * 100 : 0,
    cogsRatio: revenue > 0 ? (costOfGoodsSold / revenue) * 100 : 0,
    operatingExpenseRatio: revenue > 0 ? (operatingExpenses / revenue) * 100 : 0,
    marketingRatio: revenue > 0 ? (marketingCosts / revenue) * 100 : 0,
    taxImpactRatio: revenue > 0 ? (estimatedTax / revenue) * 100 : 0,
    retainedRevenue,
  };
}

export default function ProfitCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [revenue, setRevenue] = useState("50000");
  const [costOfGoodsSold, setCostOfGoodsSold] = useState("18000");
  const [operatingExpenses, setOperatingExpenses] = useState("12000");
  const [marketingCosts, setMarketingCosts] = useState("4000");
  const [transactionFees, setTransactionFees] = useState("2.9");
  const [taxRate, setTaxRate] = useState("20");
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(false);
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      revenue: parseNumber(revenue),
      costOfGoodsSold: parseNumber(costOfGoodsSold),
      operatingExpenses: parseNumber(operatingExpenses),
      marketingCosts: parseNumber(marketingCosts),
      transactionFees: parseNumber(transactionFees),
      taxRate: parseNumber(taxRate),
    }),
    [
      revenue,
      costOfGoodsSold,
      operatingExpenses,
      marketingCosts,
      transactionFees,
      taxRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateProfit({
        revenue: numericValues.revenue,
        costOfGoodsSold: numericValues.costOfGoodsSold,
        operatingExpenses: numericValues.operatingExpenses,
        marketingCosts: numericValues.marketingCosts,
        transactionFees: numericValues.transactionFees,
        taxRate: numericValues.taxRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (
      numericValues.revenue < 0 ||
      numericValues.costOfGoodsSold < 0 ||
      numericValues.operatingExpenses < 0 ||
      numericValues.marketingCosts < 0
    ) {
      setError("Revenue and cost values cannot be negative.");
      return false;
    }

    if (numericValues.transactionFees < 0) {
      setError("Transaction fee rate cannot be negative.");
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
    setRevenue("50000");
    setCostOfGoodsSold("18000");
    setOperatingExpenses("12000");
    setMarketingCosts("4000");
    setTransactionFees("2.9");
    setTaxRate("20");
    setShowBusinessMetrics(false);
    setShowCostDetails(false);
    setError("");
  }

  function applyScenario({
    nextRevenue,
    nextCogs,
    nextOperatingExpenses,
    nextMarketingCosts,
    nextTransactionFees,
    nextTaxRate,
  }: {
    nextRevenue: string;
    nextCogs: string;
    nextOperatingExpenses: string;
    nextMarketingCosts: string;
    nextTransactionFees: string;
    nextTaxRate: string;
  }) {
    setRevenue(nextRevenue);
    setCostOfGoodsSold(nextCogs);
    setOperatingExpenses(nextOperatingExpenses);
    setMarketingCosts(nextMarketingCosts);
    setTransactionFees(nextTransactionFees);
    setTaxRate(nextTaxRate);
    setShowBusinessMetrics(false);
    setShowCostDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate business profit online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate gross profit, operating profit, net profit, margins,
          expenses, transaction fees and taxes for a product, service or
          business.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue"
          value={formatCurrency(numericValues.revenue, currency)}
        />
        <StatCard
          label="Net profit"
          value={result ? formatCurrency(result.netProfit, currency) : "—"}
        />
        <StatCard
          label="Net margin"
          value={result ? formatPercent(result.netMargin) : "0%"}
        />
      </div>

      <ToolResultBox title="Profit details">
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
            label="Revenue"
            value={revenue}
            onChange={setRevenue}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Cost of goods sold"
            value={costOfGoodsSold}
            onChange={setCostOfGoodsSold}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Operating expenses"
            value={operatingExpenses}
            onChange={setOperatingExpenses}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Marketing costs"
            value={marketingCosts}
            onChange={setMarketingCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Transaction fees"
            value={transactionFees}
            onChange={setTransactionFees}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Tax rate"
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
                nextRevenue: "50000",
                nextCogs: "18000",
                nextOperatingExpenses: "12000",
                nextMarketingCosts: "4000",
                nextTransactionFees: "2.9",
                nextTaxRate: "20",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Small business
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextRevenue: "120000",
                nextCogs: "12000",
                nextOperatingExpenses: "38000",
                nextMarketingCosts: "18000",
                nextTransactionFees: "1.5",
                nextTaxRate: "21",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            SaaS business
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextRevenue: "85000",
                nextCogs: "36000",
                nextOperatingExpenses: "15000",
                nextMarketingCosts: "9000",
                nextTransactionFees: "3.2",
                nextTaxRate: "22",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Ecommerce store
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextRevenue: "70000",
                nextCogs: "3000",
                nextOperatingExpenses: "11000",
                nextMarketingCosts: "3500",
                nextTransactionFees: "1.9",
                nextTaxRate: "25",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Freelancer
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
          <ToolResultBox title="Profit result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Net profit"
                value={formatCurrency(result.netProfit, currency)}
                highlight
              />

              <ResultCard
                label="Gross profit"
                value={formatCurrency(result.grossProfit, currency)}
              />

              <ResultCard
                label="Operating profit"
                value={formatCurrency(result.operatingProfit, currency)}
              />

              <ResultCard
                label="Pre-tax profit"
                value={formatCurrency(result.preTaxProfit, currency)}
              />

              <ResultCard
                label="Total expenses"
                value={formatCurrency(result.totalExpenses, currency)}
              />

              <ResultCard
                label="Estimated tax"
                value={formatCurrency(result.estimatedTax, currency)}
              />

              <ResultCard
                label="Gross margin"
                value={formatPercent(result.grossMargin)}
              />

              <ResultCard
                label="Net margin"
                value={formatPercent(result.netMargin)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Estimated net profit is{" "}
              <strong className="text-black">
                {formatCurrency(result.netProfit, currency)}
              </strong>{" "}
              with a net margin of{" "}
              <strong className="text-black">
                {formatPercent(result.netMargin)}
              </strong>
              . Gross profit is{" "}
              <strong className="text-black">
                {formatCurrency(result.grossProfit, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Revenue breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Net profit"
                percentage={result.netMargin}
                formattedValue={formatCurrency(result.netProfit, currency)}
              />

              <BreakdownBar
                label="Total expenses"
                percentage={result.expenseRatio}
                formattedValue={formatCurrency(result.totalExpenses, currency)}
              />

              <BreakdownBar
                label="Estimated tax"
                percentage={result.taxImpactRatio}
                formattedValue={formatCurrency(result.estimatedTax, currency)}
              />

              <BreakdownBar
                label="Revenue retained"
                percentage={result.retainedRevenue}
                formattedValue={formatCurrency(result.netProfit, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Business metrics"
              description="Show margin, cost ratio, tax impact and retained revenue metrics."
              open={showBusinessMetrics}
              onToggle={() => setShowBusinessMetrics((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Gross margin"
                  value={formatPercent(result.grossMargin)}
                />
                <ResultCard
                  label="Operating margin"
                  value={formatPercent(result.operatingMargin)}
                />
                <ResultCard
                  label="Net margin"
                  value={formatPercent(result.netMargin)}
                />
                <ResultCard
                  label="Expense ratio"
                  value={formatPercent(result.expenseRatio)}
                />
                <ResultCard
                  label="COGS ratio"
                  value={formatPercent(result.cogsRatio)}
                />
                <ResultCard
                  label="Marketing ratio"
                  value={formatPercent(result.marketingRatio)}
                />
              </div>
            </TogglePanel>

            <TogglePanel
              title="Cost details"
              description="Show transaction fees, tax impact and detailed cost structure."
              open={showCostDetails}
              onToggle={() => setShowCostDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Cost of goods sold"
                  value={formatCurrency(numericValues.costOfGoodsSold, currency)}
                />
                <ResultCard
                  label="Operating expenses"
                  value={formatCurrency(
                    numericValues.operatingExpenses,
                    currency
                  )}
                />
                <ResultCard
                  label="Marketing costs"
                  value={formatCurrency(numericValues.marketingCosts, currency)}
                />
                <ResultCard
                  label="Transaction fees"
                  value={formatCurrency(result.transactionFeeAmount, currency)}
                />
                <ResultCard
                  label="Total costs after tax"
                  value={formatCurrency(result.totalCostsAfterTax, currency)}
                />
                <ResultCard
                  label="Tax impact"
                  value={formatPercent(result.taxImpactRatio)}
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid revenue, cost and tax assumptions to calculate profit.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual profit can vary due to
        refunds, discounts, chargebacks, local taxes, payroll, overhead,
        accounting methods and timing.
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
            {formatPercent(percentage)} of revenue
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