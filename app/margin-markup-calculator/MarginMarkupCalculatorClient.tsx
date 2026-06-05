"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function MarginMarkupCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [cost, setCost] = useState(25);
  const [sellingPrice, setSellingPrice] = useState(49);
  const [quantity, setQuantity] = useState(100);
  const [fixedCosts, setFixedCosts] = useState(500);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
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
    const variableCost = cost * quantity;
    const grossProfit = revenue - variableCost;
    const netProfit = grossProfit - fixedCosts;

    const breakEvenUnits =
      grossProfitPerUnit > 0 ? Math.ceil(fixedCosts / grossProfitPerUnit) : null;

    const breakEvenRevenue =
      breakEvenUnits !== null ? breakEvenUnits * discountedPrice : null;

    const targetPriceFor30Margin =
      cost > 0 ? cost / (1 - 0.3) : 0;

    const targetPriceFor50Markup =
      cost > 0 ? cost * 1.5 : 0;

    return {
      discountedPrice,
      priceAfterTax,
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
      targetPriceFor50Markup,
    };
  }, [
    cost,
    sellingPrice,
    quantity,
    fixedCosts,
    discountPercent,
    taxPercent,
  ]);

  function validateInputs() {
    if (cost < 0 || sellingPrice < 0 || quantity < 0 || fixedCosts < 0) {
      setError("Cost, price, quantity and fixed costs cannot be negative.");
      return false;
    }

    if (
      discountPercent < 0 ||
      discountPercent > 100 ||
      taxPercent < 0 ||
      taxPercent > 100
    ) {
      setError("Discount and tax percentages must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setCost(25);
    setSellingPrice(49);
    setQuantity(100);
    setFixedCosts(500);
    setDiscountPercent(0);
    setTaxPercent(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate margin and markup
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate profit margin, markup, break-even units, discounts, taxes
          and total profit from cost and selling price.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Cost per unit" value={cost} onChange={setCost} onBlur={validateInputs} />
          <NumberInput label="Selling price" value={sellingPrice} onChange={setSellingPrice} onBlur={validateInputs} />
          <NumberInput label="Quantity sold" value={quantity} onChange={setQuantity} onBlur={validateInputs} />
          <NumberInput label="Fixed costs" value={fixedCosts} onChange={setFixedCosts} onBlur={validateInputs} />
          <NumberInput label="Discount %" value={discountPercent} onChange={setDiscountPercent} onBlur={validateInputs} />
          <NumberInput label="Tax / VAT %" value={taxPercent} onChange={setTaxPercent} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Margin and markup result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Profit margin" value={formatPercent(result.margin)} highlight />
            <ResultCard label="Markup" value={formatPercent(result.markup)} />
            <ResultCard label="Profit per unit" value={formatCurrency(result.grossProfitPerUnit, currency)} />
            <ResultCard label="Discounted price" value={formatCurrency(result.discountedPrice, currency)} />
            <ResultCard label="Price after tax" value={formatCurrency(result.priceAfterTax, currency)} />
            <ResultCard label="Revenue" value={formatCurrency(result.revenue, currency)} />
            <ResultCard label="Variable cost" value={formatCurrency(result.variableCost, currency)} />
            <ResultCard label="Gross profit" value={formatCurrency(result.grossProfit, currency)} />
            <ResultCard label="Net profit" value={formatCurrency(result.netProfit, currency)} />
            <ResultCard label="Break-even units" value={result.breakEvenUnits !== null ? String(result.breakEvenUnits) : "Not profitable"} />
            <ResultCard label="Break-even revenue" value={result.breakEvenRevenue !== null ? formatCurrency(result.breakEvenRevenue, currency) : "Not profitable"} />
            <ResultCard label="Price for 30% margin" value={formatCurrency(result.targetPriceFor30Margin, currency)} />
            <ResultCard label="Price for 50% markup" value={formatCurrency(result.targetPriceFor50Markup, currency)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your profit margin is{" "}
            <strong className="text-black">{formatPercent(result.margin)}</strong>{" "}
            and your markup is{" "}
            <strong className="text-black">{formatPercent(result.markup)}</strong>.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid pricing and cost values to calculate margin, markup and
          break-even numbers.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Margin is profit divided by selling price. Markup is profit divided by
        cost. Both are useful, but they measure different things.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
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