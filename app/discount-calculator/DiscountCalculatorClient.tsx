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

export default function DiscountCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [originalPrice, setOriginalPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState(10);
  const [taxPercent, setTaxPercent] = useState(8);
  const [shippingCost, setShippingCost] = useState(5);
  const [quantity, setQuantity] = useState(2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      originalPrice < 0 ||
      discountPercent < 0 ||
      discountPercent > 100 ||
      additionalDiscountPercent < 0 ||
      additionalDiscountPercent > 100 ||
      taxPercent < 0 ||
      taxPercent > 100 ||
      shippingCost < 0 ||
      quantity < 0
    ) {
      return null;
    }

    const firstDiscount = originalPrice * (discountPercent / 100);
    const priceAfterFirstDiscount = originalPrice - firstDiscount;
    const secondDiscount =
      priceAfterFirstDiscount * (additionalDiscountPercent / 100);
    const finalUnitPrice = priceAfterFirstDiscount - secondDiscount;

    const subtotal = finalUnitPrice * quantity;
    const taxAmount = subtotal * (taxPercent / 100);
    const total = subtotal + taxAmount + shippingCost;
    const originalTotal = originalPrice * quantity;
    const totalSaved = originalTotal - subtotal;

    return {
      firstDiscount,
      secondDiscount,
      finalUnitPrice,
      subtotal,
      taxAmount,
      total,
      originalTotal,
      totalSaved,
      effectiveDiscount:
        originalPrice > 0 ? ((originalPrice - finalUnitPrice) / originalPrice) * 100 : 0,
    };
  }, [
    originalPrice,
    discountPercent,
    additionalDiscountPercent,
    taxPercent,
    shippingCost,
    quantity,
  ]);

  function validateInputs() {
    if (originalPrice < 0 || shippingCost < 0 || quantity < 0) {
      setError("Price, shipping and quantity cannot be negative.");
      return false;
    }

    if (
      discountPercent < 0 ||
      discountPercent > 100 ||
      additionalDiscountPercent < 0 ||
      additionalDiscountPercent > 100 ||
      taxPercent < 0 ||
      taxPercent > 100
    ) {
      setError("Percentage values must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setOriginalPrice(120);
    setDiscountPercent(25);
    setAdditionalDiscountPercent(10);
    setTaxPercent(8);
    setShippingCost(5);
    setQuantity(2);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate discount price
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate final price after discounts, stacked discounts, tax,
          shipping and quantity.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Original unit price" value={originalPrice} onChange={setOriginalPrice} onBlur={validateInputs} />
          <NumberInput label="Discount %" value={discountPercent} onChange={setDiscountPercent} onBlur={validateInputs} />
          <NumberInput label="Additional discount %" value={additionalDiscountPercent} onChange={setAdditionalDiscountPercent} onBlur={validateInputs} />
          <NumberInput label="Tax / VAT %" value={taxPercent} onChange={setTaxPercent} onBlur={validateInputs} />
          <NumberInput label="Shipping cost" value={shippingCost} onChange={setShippingCost} onBlur={validateInputs} />
          <NumberInput label="Quantity" value={quantity} onChange={setQuantity} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Discount result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Final total" value={formatCurrency(result.total, currency)} highlight />
            <ResultCard label="Final unit price" value={formatCurrency(result.finalUnitPrice, currency)} />
            <ResultCard label="Subtotal after discount" value={formatCurrency(result.subtotal, currency)} />
            <ResultCard label="Total saved" value={formatCurrency(result.totalSaved, currency)} />
            <ResultCard label="Effective discount" value={`${result.effectiveDiscount.toFixed(2)}%`} />
            <ResultCard label="Tax amount" value={formatCurrency(result.taxAmount, currency)} />
            <ResultCard label="First discount" value={formatCurrency(result.firstDiscount, currency)} />
            <ResultCard label="Additional discount" value={formatCurrency(result.secondDiscount, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid price and discount values.
        </ToolInfoBox>
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange, onBlur }: { label: string; value: number; onChange: (value: number) => void; onBlur: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}