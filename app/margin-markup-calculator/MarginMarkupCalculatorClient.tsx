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

function formatUnits(value: number | null) {
  if (value === null) return "Not profitable";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateMarginMarkup({
  cost,
  sellingPrice,
  quantity,
  fixedCosts,
  discountPercent,
  taxPercent,
}: {
  cost: number;
  sellingPrice: number;
  quantity: number;
  fixedCosts: number;
  discountPercent: number;
  taxPercent: number;
}) {
  if (
    cost < 0 ||
    sellingPrice < 0 ||
    quantity < 0 ||
    fixedCosts < 0 ||
    discountPercent < 0 ||
    discountPercent > 100 ||
    taxPercent < 0 ||
    taxPercent > 100
  ) {
    return null;
  }

  const discountedPrice = sellingPrice * (1 - discountPercent / 100);
  const priceAfterTax = discountedPrice * (1 + taxPercent / 100);
  const grossProfitPerUnit = discountedPrice - cost;
  const margin =
    discountedPrice > 0 ? (grossProfitPerUnit / discountedPrice) * 100 : 0;
  const markup = cost > 0 ? (grossProfitPerUnit / cost) * 100 : 0;

  const revenue = discountedPrice * quantity;
  const taxAmount = revenue * (taxPercent / 100);
  const totalCustomerPrice = revenue + taxAmount;
  const variableCost = cost * quantity;
  const grossProfit = revenue - variableCost;
  const netProfit = grossProfit - fixedCosts;

  const breakEvenUnits =
    grossProfitPerUnit > 0 ? Math.ceil(fixedCosts / grossProfitPerUnit) : null;

  const breakEvenRevenue =
    breakEvenUnits !== null ? breakEvenUnits * discountedPrice : null;

  const targetPriceFor30Margin = cost > 0 ? cost / (1 - 0.3) : 0;
  const targetPriceFor50Markup = cost > 0 ? cost * 1.5 : 0;
  const targetPriceFor40Margin = cost > 0 ? cost / (1 - 0.4) : 0;
  const targetPriceFor100Markup = cost > 0 ? cost * 2 : 0;
  const discountAmount = sellingPrice - discountedPrice;
  const profitRatio =
    revenue > 0 ? Math.max(0, Math.min(100, (netProfit / revenue) * 100)) : 0;
  const costRatio =
    revenue > 0 ? Math.max(0, Math.min(100, (variableCost / revenue) * 100)) : 0;
  const fixedCostRatio =
    revenue > 0 ? Math.max(0, Math.min(100, (fixedCosts / revenue) * 100)) : 0;

  return {
    discountedPrice,
    priceAfterTax,
    taxAmount,
    totalCustomerPrice,
    grossProfitPerUnit,
    margin,
    markup,
    revenue,
    variableCost,
    grossProfit,
    netProfit,
    breakEvenUnits,
    breakEvenRevenue,
    targetPriceFor30Margin,
    targetPriceFor40Margin,
    targetPriceFor50Markup,
    targetPriceFor100Markup,
    discountAmount,
    profitRatio,
    costRatio,
    fixedCostRatio,
  };
}

export default function MarginMarkupCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [cost, setCost] = useState("25");
  const [sellingPrice, setSellingPrice] = useState("49");
  const [quantity, setQuantity] = useState("100");
  const [fixedCosts, setFixedCosts] = useState("500");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [taxPercent, setTaxPercent] = useState("0");
  const [showPricingTargets, setShowPricingTargets] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      cost: parseNumber(cost),
      sellingPrice: parseNumber(sellingPrice),
      quantity: parseNumber(quantity),
      fixedCosts: parseNumber(fixedCosts),
      discountPercent: parseNumber(discountPercent),
      taxPercent: parseNumber(taxPercent),
    }),
    [cost, sellingPrice, quantity, fixedCosts, discountPercent, taxPercent]
  );

  const result = useMemo(
    () =>
      calculateMarginMarkup({
        cost: numericValues.cost,
        sellingPrice: numericValues.sellingPrice,
        quantity: numericValues.quantity,
        fixedCosts: numericValues.fixedCosts,
        discountPercent: numericValues.discountPercent,
        taxPercent: numericValues.taxPercent,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (
      numericValues.cost < 0 ||
      numericValues.sellingPrice < 0 ||
      numericValues.quantity < 0 ||
      numericValues.fixedCosts < 0
    ) {
      setError("Cost, price, quantity and fixed costs cannot be negative.");
      return false;
    }

    if (
      numericValues.discountPercent < 0 ||
      numericValues.discountPercent > 100 ||
      numericValues.taxPercent < 0 ||
      numericValues.taxPercent > 100
    ) {
      setError("Discount and tax percentages must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setCost("25");
    setSellingPrice("49");
    setQuantity("100");
    setFixedCosts("500");
    setDiscountPercent("0");
    setTaxPercent("0");
    setShowPricingTargets(false);
    setShowFormulaDetails(false);
    setError("");
  }

  function applyScenario({
    nextCost,
    nextPrice,
    nextQuantity,
    nextFixedCosts,
    nextDiscount,
    nextTax,
  }: {
    nextCost: string;
    nextPrice: string;
    nextQuantity: string;
    nextFixedCosts: string;
    nextDiscount: string;
    nextTax: string;
  }) {
    setCost(nextCost);
    setSellingPrice(nextPrice);
    setQuantity(nextQuantity);
    setFixedCosts(nextFixedCosts);
    setDiscountPercent(nextDiscount);
    setTaxPercent(nextTax);
    setShowPricingTargets(false);
    setShowFormulaDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate margin and markup online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate profit margin, markup, selling price, break-even units,
          discounts, taxes and total profit from cost and selling price.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Profit margin"
          value={result ? formatPercent(result.margin) : "0%"}
        />
        <StatCard
          label="Markup"
          value={result ? formatPercent(result.markup) : "0%"}
        />
        <StatCard
          label="Profit per unit"
          value={
            result
              ? formatCurrency(result.grossProfitPerUnit, currency)
              : "—"
          }
        />
      </div>

      <ToolResultBox title="Margin and markup details">
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
            label="Cost per unit"
            value={cost}
            onChange={setCost}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Selling price"
            value={sellingPrice}
            onChange={setSellingPrice}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Quantity sold"
            value={quantity}
            onChange={setQuantity}
            onBlur={validateInputs}
          />

          <TextNumberInput
            label="Fixed costs"
            value={fixedCosts}
            onChange={setFixedCosts}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Discount"
            value={discountPercent}
            onChange={setDiscountPercent}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Tax / VAT"
            value={taxPercent}
            onChange={setTaxPercent}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextCost: "25",
                nextPrice: "49",
                nextQuantity: "100",
                nextFixedCosts: "500",
                nextDiscount: "0",
                nextTax: "0",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Product pricing
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextCost: "12",
                nextPrice: "39",
                nextQuantity: "250",
                nextFixedCosts: "1500",
                nextDiscount: "10",
                nextTax: "8",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Ecommerce sale
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                nextCost: "8",
                nextPrice: "29",
                nextQuantity: "600",
                nextFixedCosts: "2500",
                nextDiscount: "0",
                nextTax: "20",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            High volume
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
          <ToolResultBox title="Margin and markup result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Profit margin"
                value={formatPercent(result.margin)}
                highlight
              />

              <ResultCard label="Markup" value={formatPercent(result.markup)} />

              <ResultCard
                label="Profit per unit"
                value={formatCurrency(result.grossProfitPerUnit, currency)}
              />

              <ResultCard
                label="Discounted price"
                value={formatCurrency(result.discountedPrice, currency)}
              />

              <ResultCard
                label="Revenue"
                value={formatCurrency(result.revenue, currency)}
              />

              <ResultCard
                label="Gross profit"
                value={formatCurrency(result.grossProfit, currency)}
              />

              <ResultCard
                label="Net profit"
                value={formatCurrency(result.netProfit, currency)}
              />

              <ResultCard
                label="Break-even units"
                value={formatUnits(result.breakEvenUnits)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Your profit margin is{" "}
              <strong className="text-black">{formatPercent(result.margin)}</strong>{" "}
              and your markup is{" "}
              <strong className="text-black">{formatPercent(result.markup)}</strong>.
              Estimated net profit is{" "}
              <strong className="text-black">
                {formatCurrency(result.netProfit, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Revenue and cost breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Net profit"
                percentage={result.profitRatio}
                formattedValue={formatCurrency(result.netProfit, currency)}
              />

              <BreakdownBar
                label="Variable cost"
                percentage={result.costRatio}
                formattedValue={formatCurrency(result.variableCost, currency)}
              />

              <BreakdownBar
                label="Fixed costs"
                percentage={result.fixedCostRatio}
                formattedValue={formatCurrency(numericValues.fixedCosts, currency)}
              />

              <BreakdownBar
                label="Tax / VAT amount"
                percentage={
                  result.totalCustomerPrice > 0
                    ? (result.taxAmount / result.totalCustomerPrice) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.taxAmount, currency)}
              />
            </div>
          </ToolResultBox>

          <div className="grid gap-4">
            <TogglePanel
              title="Pricing target details"
              description="Show target prices for common margin and markup goals."
              open={showPricingTargets}
              onToggle={() => setShowPricingTargets((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ResultCard
                  label="Price for 30% margin"
                  value={formatCurrency(result.targetPriceFor30Margin, currency)}
                />

                <ResultCard
                  label="Price for 40% margin"
                  value={formatCurrency(result.targetPriceFor40Margin, currency)}
                />

                <ResultCard
                  label="Price for 50% markup"
                  value={formatCurrency(result.targetPriceFor50Markup, currency)}
                />

                <ResultCard
                  label="Price for 100% markup"
                  value={formatCurrency(result.targetPriceFor100Markup, currency)}
                />

                <ResultCard
                  label="Price after tax"
                  value={formatCurrency(result.priceAfterTax, currency)}
                />

                <ResultCard
                  label="Break-even revenue"
                  value={
                    result.breakEvenRevenue !== null
                      ? formatCurrency(result.breakEvenRevenue, currency)
                      : "Not profitable"
                  }
                />
              </div>
            </TogglePanel>

            <TogglePanel
              title="Margin vs markup formulas"
              description="Show the difference between margin and markup and how both are calculated."
              open={showFormulaDetails}
              onToggle={() => setShowFormulaDetails((current) => !current)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormulaCard
                  title="Profit margin"
                  text="Margin = Profit per unit ÷ Selling price × 100"
                />

                <FormulaCard
                  title="Markup"
                  text="Markup = Profit per unit ÷ Cost per unit × 100"
                />

                <FormulaCard
                  title="Profit per unit"
                  text="Profit per unit = Selling price after discount - Cost per unit"
                />

                <FormulaCard
                  title="Break-even units"
                  text="Break-even units = Fixed costs ÷ Profit per unit"
                />
              </div>
            </TogglePanel>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid pricing and cost values to calculate margin, markup and
          break-even numbers.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Margin is profit divided by selling price. Markup is profit divided by
        cost. Both are useful, but they measure different things and should not
        be treated as the same percentage.
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