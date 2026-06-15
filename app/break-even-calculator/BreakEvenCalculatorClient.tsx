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

function formatUnits(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateBreakEven({
  sellingPrice,
  variableCostPerUnit,
  fixedCosts,
  targetProfit,
  expectedUnits,
  taxRate,
}: {
  sellingPrice: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  targetProfit: number;
  expectedUnits: number;
  taxRate: number;
}) {
  if (
    sellingPrice < 0 ||
    variableCostPerUnit < 0 ||
    fixedCosts < 0 ||
    targetProfit < 0 ||
    expectedUnits < 0 ||
    taxRate < 0 ||
    taxRate > 100
  ) {
    return null;
  }

  const contributionMargin = sellingPrice - variableCostPerUnit;

  if (contributionMargin <= 0) {
    return null;
  }

  const contributionMarginRatio =
    sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0;

  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * sellingPrice;

  const targetProfitBeforeTax =
    taxRate >= 100 ? targetProfit : targetProfit / (1 - taxRate / 100);

  const targetUnits = Math.ceil(
    (fixedCosts + targetProfitBeforeTax) / contributionMargin
  );

  const expectedRevenue = expectedUnits * sellingPrice;
  const expectedVariableCosts = expectedUnits * variableCostPerUnit;
  const expectedGrossContribution =
    expectedRevenue - expectedVariableCosts;
  const expectedPreTaxProfit = expectedGrossContribution - fixedCosts;
  const expectedTax =
    expectedPreTaxProfit > 0 ? expectedPreTaxProfit * (taxRate / 100) : 0;
  const expectedNetProfit = expectedPreTaxProfit - expectedTax;
  const safetyMarginUnits = expectedUnits - breakEvenUnits;
  const safetyMarginPercent =
    expectedUnits > 0 ? (safetyMarginUnits / expectedUnits) * 100 : 0;
  const fixedCostPerExpectedUnit =
    expectedUnits > 0 ? fixedCosts / expectedUnits : 0;
  const expectedTotalCost = fixedCosts + expectedVariableCosts + expectedTax;
  const expectedNetMargin =
    expectedRevenue > 0 ? (expectedNetProfit / expectedRevenue) * 100 : 0;
  const expectedCostRatio =
    expectedRevenue > 0 ? (expectedTotalCost / expectedRevenue) * 100 : 0;

  return {
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    breakEvenRevenue,
    targetProfitBeforeTax,
    targetUnits,
    targetRevenue: targetUnits * sellingPrice,
    expectedRevenue,
    expectedVariableCosts,
    expectedGrossContribution,
    expectedPreTaxProfit,
    expectedTax,
    expectedNetProfit,
    safetyMarginUnits,
    safetyMarginPercent,
    fixedCostPerExpectedUnit,
    expectedTotalCost,
    expectedNetMargin,
    expectedCostRatio,
  };
}

export default function BreakEvenCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [sellingPrice, setSellingPrice] = useState("49");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("22");
  const [fixedCosts, setFixedCosts] = useState("5000");
  const [targetProfit, setTargetProfit] = useState("2500");
  const [expectedUnits, setExpectedUnits] = useState("300");
  const [taxRate, setTaxRate] = useState("0");
  const [showExpectedSales, setShowExpectedSales] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      sellingPrice: parseNumber(sellingPrice),
      variableCostPerUnit: parseNumber(variableCostPerUnit),
      fixedCosts: parseNumber(fixedCosts),
      targetProfit: parseNumber(targetProfit),
      expectedUnits: parseNumber(expectedUnits),
      taxRate: parseNumber(taxRate),
    }),
    [
      sellingPrice,
      variableCostPerUnit,
      fixedCosts,
      targetProfit,
      expectedUnits,
      taxRate,
    ]
  );

  const result = useMemo(
    () =>
      calculateBreakEven({
        sellingPrice: numericValues.sellingPrice,
        variableCostPerUnit: numericValues.variableCostPerUnit,
        fixedCosts: numericValues.fixedCosts,
        targetProfit: numericValues.targetProfit,
        expectedUnits: numericValues.expectedUnits,
        taxRate: numericValues.taxRate,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (
      numericValues.sellingPrice < 0 ||
      numericValues.variableCostPerUnit < 0 ||
      numericValues.fixedCosts < 0 ||
      numericValues.targetProfit < 0 ||
      numericValues.expectedUnits < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (numericValues.taxRate < 0 || numericValues.taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    if (numericValues.sellingPrice <= numericValues.variableCostPerUnit) {
      setError("Selling price must be higher than variable cost per unit.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setSellingPrice("49");
    setVariableCostPerUnit("22");
    setFixedCosts("5000");
    setTargetProfit("2500");
    setExpectedUnits("300");
    setTaxRate("0");
    setShowExpectedSales(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    price,
    variableCost,
    fixed,
    profit,
    units,
    tax,
  }: {
    price: string;
    variableCost: string;
    fixed: string;
    profit: string;
    units: string;
    tax: string;
  }) {
    setSellingPrice(price);
    setVariableCostPerUnit(variableCost);
    setFixedCosts(fixed);
    setTargetProfit(profit);
    setExpectedUnits(units);
    setTaxRate(tax);
    setShowExpectedSales(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate break-even point online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate how many units you need to sell to cover fixed costs, reach
          a target profit and understand contribution margin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Break-even units"
          value={result ? formatUnits(result.breakEvenUnits) : "—"}
        />
        <StatCard
          label="Break-even revenue"
          value={result ? formatCurrency(result.breakEvenRevenue, currency) : "—"}
        />
        <StatCard
          label="Contribution margin"
          value={result ? formatCurrency(result.contributionMargin, currency) : "—"}
        />
      </div>

      <ToolResultBox title="Break-even details">
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
            label="Selling price per unit"
            value={sellingPrice}
            onChange={setSellingPrice}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Variable cost per unit"
            value={variableCostPerUnit}
            onChange={setVariableCostPerUnit}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Fixed costs"
            value={fixedCosts}
            onChange={setFixedCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Target profit after tax"
            value={targetProfit}
            onChange={setTargetProfit}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Expected units sold"
            value={expectedUnits}
            onChange={setExpectedUnits}
            onBlur={validateInputs}
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
                price: "49",
                variableCost: "22",
                fixed: "5000",
                profit: "2500",
                units: "300",
                tax: "0",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Physical product
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                price: "29",
                variableCost: "3",
                fixed: "12000",
                profit: "6000",
                units: "900",
                tax: "20",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            SaaS product
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                price: "85",
                variableCost: "35",
                fixed: "8000",
                profit: "4000",
                units: "250",
                tax: "20",
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
                price: "120",
                variableCost: "20",
                fixed: "3500",
                profit: "5000",
                units: "100",
                tax: "25",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Service business
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
          <ToolResultBox title="Break-even result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Break-even units"
                value={formatUnits(result.breakEvenUnits)}
                highlight
              />

              <ResultCard
                label="Break-even revenue"
                value={formatCurrency(result.breakEvenRevenue, currency)}
              />

              <ResultCard
                label="Contribution margin"
                value={formatCurrency(result.contributionMargin, currency)}
              />

              <ResultCard
                label="Contribution margin ratio"
                value={formatPercent(result.contributionMarginRatio)}
              />

              <ResultCard
                label="Units for target profit"
                value={formatUnits(result.targetUnits)}
              />

              <ResultCard
                label="Revenue for target profit"
                value={formatCurrency(result.targetRevenue, currency)}
              />

              <ResultCard
                label="Expected net profit"
                value={formatCurrency(result.expectedNetProfit, currency)}
              />

              <ResultCard
                label="Safety margin"
                value={formatPercent(result.safetyMarginPercent)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              You need to sell{" "}
              <strong className="text-black">
                {formatUnits(result.breakEvenUnits)}
              </strong>{" "}
              units to break even, generating{" "}
              <strong className="text-black">
                {formatCurrency(result.breakEvenRevenue, currency)}
              </strong>{" "}
              in revenue. To reach the target profit, estimated required sales
              are{" "}
              <strong className="text-black">
                {formatUnits(result.targetUnits)}
              </strong>{" "}
              units.
            </div>
          </ToolResultBox>

          <ToolResultBox title="Cost and margin breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Contribution margin ratio"
                percentage={result.contributionMarginRatio}
                formattedValue={formatCurrency(
                  result.contributionMargin,
                  currency
                )}
              />

              <BreakdownBar
                label="Expected cost ratio"
                percentage={result.expectedCostRatio}
                formattedValue={formatCurrency(result.expectedTotalCost, currency)}
              />

              <BreakdownBar
                label="Expected net margin"
                percentage={result.expectedNetMargin}
                formattedValue={formatCurrency(result.expectedNetProfit, currency)}
              />

              <BreakdownBar
                label="Safety margin"
                percentage={result.safetyMarginPercent}
                formattedValue={`${formatUnits(result.safetyMarginUnits)} units`}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Expected sales details"
              description="Show expected revenue, variable costs, taxes and profit at the expected sales volume."
              open={showExpectedSales}
              onToggle={() => setShowExpectedSales((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Expected revenue"
                  value={formatCurrency(result.expectedRevenue, currency)}
                />

                <ResultCard
                  label="Expected variable costs"
                  value={formatCurrency(
                    result.expectedVariableCosts,
                    currency
                  )}
                />

                <ResultCard
                  label="Gross contribution"
                  value={formatCurrency(
                    result.expectedGrossContribution,
                    currency
                  )}
                />

                <ResultCard
                  label="Pre-tax profit"
                  value={formatCurrency(result.expectedPreTaxProfit, currency)}
                />

                <ResultCard
                  label="Expected tax"
                  value={formatCurrency(result.expectedTax, currency)}
                />

                <ResultCard
                  label="Fixed cost per expected unit"
                  value={formatCurrency(
                    result.fixedCostPerExpectedUnit,
                    currency
                  )}
                />
              </div>
            </TogglePanel>

            <TogglePanel
              title="Break-even formula details"
              description="Show the formulas used for break-even units, contribution margin and target profit."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="Contribution margin"
                  text="Contribution margin = Selling price per unit - Variable cost per unit"
                />

                <FormulaCard
                  title="Break-even units"
                  text="Break-even units = Fixed costs ÷ Contribution margin per unit"
                />

                <FormulaCard
                  title="Break-even revenue"
                  text="Break-even revenue = Break-even units × Selling price per unit"
                />

                <FormulaCard
                  title="Target profit units"
                  text="Target units = Fixed costs plus target profit before tax ÷ Contribution margin per unit"
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Selling price must be higher than variable cost per unit to calculate
          a break-even point.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Break-even analysis works best when fixed costs and variable costs are
        separated clearly. It helps estimate risk before launching products,
        campaigns, subscriptions or services.
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