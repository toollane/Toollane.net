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

export default function SimpleInterestCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(5);
  const [years, setYears] = useState(3);
  const [taxRate, setTaxRate] = useState(0);
  const [inflationRate, setInflationRate] = useState(2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      principal < 0 ||
      annualRate < 0 ||
      years < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      inflationRate < 0
    ) {
      return null;
    }

    const interest = principal * (annualRate / 100) * years;
    const tax = interest * (taxRate / 100);
    const afterTaxInterest = interest - tax;
    const finalAmount = principal + interest;
    const afterTaxAmount = principal + afterTaxInterest;
    const inflationAdjustedAmount =
      afterTaxAmount / Math.pow(1 + inflationRate / 100, years);

    return {
      interest,
      tax,
      afterTaxInterest,
      finalAmount,
      afterTaxAmount,
      inflationAdjustedAmount,
      effectiveReturn: principal > 0 ? (afterTaxInterest / principal) * 100 : 0,
    };
  }, [principal, annualRate, years, taxRate, inflationRate]);

  function validateInputs() {
    if (principal < 0 || annualRate < 0 || years < 0 || inflationRate < 0) {
      setError("Values cannot be negative.");
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
    setPrincipal(10000);
    setAnnualRate(5);
    setYears(3);
    setTaxRate(0);
    setInflationRate(2);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate simple interest
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate simple interest, total amount, after-tax interest and
          inflation-adjusted value.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Principal amount" value={principal} onChange={setPrincipal} onBlur={validateInputs} />
          <NumberInput label="Annual interest rate %" value={annualRate} onChange={setAnnualRate} onBlur={validateInputs} />
          <NumberInput label="Years" value={years} onChange={setYears} onBlur={validateInputs} />
          <NumberInput label="Tax rate on interest %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
          <NumberInput label="Inflation rate %" value={inflationRate} onChange={setInflationRate} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Simple interest result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Final amount" value={formatCurrency(result.finalAmount, currency)} highlight />
            <ResultCard label="Simple interest" value={formatCurrency(result.interest, currency)} />
            <ResultCard label="After-tax amount" value={formatCurrency(result.afterTaxAmount, currency)} />
            <ResultCard label="After-tax interest" value={formatCurrency(result.afterTaxInterest, currency)} />
            <ResultCard label="Estimated tax" value={formatCurrency(result.tax, currency)} />
            <ResultCard label="Inflation-adjusted value" value={formatCurrency(result.inflationAdjustedAmount, currency)} />
            <ResultCard label="Effective after-tax return" value={`${result.effectiveReturn.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid interest assumptions to calculate simple interest.
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