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

export default function SalesTaxCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [subtotal, setSubtotal] = useState(250);
  const [taxRate, setTaxRate] = useState(8.25);
  const [shipping, setShipping] = useState(10);
  const [discount, setDiscount] = useState(25);
  const [shippingTaxable, setShippingTaxable] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      subtotal < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      shipping < 0 ||
      discount < 0
    ) {
      return null;
    }

    const taxableSubtotal = Math.max(0, subtotal - discount);
    const taxableAmount = taxableSubtotal + (shippingTaxable ? shipping : 0);
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableSubtotal + shipping + taxAmount;

    return {
      taxableSubtotal,
      taxableAmount,
      taxAmount,
      total,
      effectiveTaxRate: total > 0 ? (taxAmount / total) * 100 : 0,
    };
  }, [subtotal, taxRate, shipping, discount, shippingTaxable]);

  function validateInputs() {
    if (subtotal < 0 || shipping < 0 || discount < 0) {
      setError("Subtotal, shipping and discount cannot be negative.");
      return false;
    }

    if (taxRate < 0 || taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setSubtotal(250);
    setTaxRate(8.25);
    setShipping(10);
    setDiscount(25);
    setShippingTaxable(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate sales tax
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate sales tax or VAT-style totals with discounts, shipping and
          taxable shipping options.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Subtotal" value={subtotal} onChange={setSubtotal} onBlur={validateInputs} />
          <NumberInput label="Tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
          <NumberInput label="Shipping" value={shipping} onChange={setShipping} onBlur={validateInputs} />
          <NumberInput label="Discount amount" value={discount} onChange={setDiscount} onBlur={validateInputs} />
        </div>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span>
            <span className="block text-sm font-bold text-black">
              Tax shipping
            </span>
            <span className="mt-1 block text-xs leading-5 text-black/50">
              Enable this if shipping is taxable in your situation.
            </span>
          </span>

          <input
            type="checkbox"
            checked={shippingTaxable}
            onChange={(event) => setShippingTaxable(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Sales tax result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Total" value={formatCurrency(result.total, currency)} highlight />
            <ResultCard label="Tax amount" value={formatCurrency(result.taxAmount, currency)} />
            <ResultCard label="Taxable subtotal" value={formatCurrency(result.taxableSubtotal, currency)} />
            <ResultCard label="Taxable amount" value={formatCurrency(result.taxableAmount, currency)} />
            <ResultCard label="Shipping" value={formatCurrency(shipping, currency)} />
            <ResultCard label="Discount" value={formatCurrency(discount, currency)} />
            <ResultCard label="Effective tax rate" value={`${result.effectiveTaxRate.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid tax values to calculate the total.
        </ToolInfoBox>
      )}
    </div>
  );
}

function CurrencySelect({ currency, setCurrency }: { currency: CurrencyCode; setCurrency: (currency: CurrencyCode) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">Currency</span>
      <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
        <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
      </select>
    </label>
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