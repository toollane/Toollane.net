"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type VatMode = "add" | "remove";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export default function VatCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [mode, setMode] = useState<VatMode>("add");
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(19);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      amount < 0 ||
      vatRate < 0 ||
      vatRate > 100 ||
      discountPercent < 0 ||
      discountPercent > 100 ||
      quantity <= 0
    ) {
      return null;
    }

    const discountedAmount = amount * (1 - discountPercent / 100);
    const lineAmount = discountedAmount * quantity;

    if (mode === "add") {
      const vatAmount = lineAmount * (vatRate / 100);
      const grossAmount = lineAmount + vatAmount;

      return {
        netAmount: lineAmount,
        vatAmount,
        grossAmount,
        unitNet: discountedAmount,
        unitGross: discountedAmount * (1 + vatRate / 100),
      };
    }

    const netAmount = lineAmount / (1 + vatRate / 100);
    const vatAmount = lineAmount - netAmount;

    return {
      netAmount,
      vatAmount,
      grossAmount: lineAmount,
      unitNet: netAmount / quantity,
      unitGross: discountedAmount,
    };
  }, [amount, vatRate, discountPercent, quantity, mode]);

  function validateInputs() {
    if (amount < 0) {
      setError("Amount cannot be negative.");
      return false;
    }

    if (vatRate < 0 || vatRate > 100 || discountPercent < 0 || discountPercent > 100) {
      setError("VAT and discount percentages must be between 0 and 100.");
      return false;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("EUR");
    setMode("add");
    setAmount(100);
    setVatRate(19);
    setDiscountPercent(0);
    setQuantity(1);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate VAT
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Add or remove VAT from prices with quantity and discount support.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <label className="block">
          <span className="text-sm font-bold text-black">VAT mode</span>

          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as VatMode);
              setError("");
            }}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="add">Add VAT to net amount</option>
            <option value="remove">Remove VAT from gross amount</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label={mode === "add" ? "Net amount" : "Gross amount"} value={amount} onChange={setAmount} onBlur={validateInputs} />
          <NumberInput label="VAT rate %" value={vatRate} onChange={setVatRate} onBlur={validateInputs} />
          <NumberInput label="Discount %" value={discountPercent} onChange={setDiscountPercent} onBlur={validateInputs} />
          <NumberInput label="Quantity" value={quantity} onChange={setQuantity} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="VAT result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Gross amount" value={formatCurrency(result.grossAmount, currency)} highlight />
            <ResultCard label="Net amount" value={formatCurrency(result.netAmount, currency)} />
            <ResultCard label="VAT amount" value={formatCurrency(result.vatAmount, currency)} />
            <ResultCard label="Unit gross" value={formatCurrency(result.unitGross, currency)} />
            <ResultCard label="Unit net" value={formatCurrency(result.unitNet, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid VAT values to calculate net and gross amounts.
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