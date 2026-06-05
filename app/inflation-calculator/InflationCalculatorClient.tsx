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

export default function InflationCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);
  const [incomeGrowthRate, setIncomeGrowthRate] = useState(2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      amount < 0 ||
      inflationRate < 0 ||
      years < 0 ||
      incomeGrowthRate < 0
    ) {
      return null;
    }

    const futureCost = amount * Math.pow(1 + inflationRate / 100, years);
    const purchasingPower = amount / Math.pow(1 + inflationRate / 100, years);
    const incomeAdjustedAmount = amount * Math.pow(1 + incomeGrowthRate / 100, years);
    const realIncomeChange =
      futureCost > 0 ? ((incomeAdjustedAmount - futureCost) / futureCost) * 100 : 0;

    return {
      futureCost,
      purchasingPower,
      totalInflation: futureCost - amount,
      incomeAdjustedAmount,
      realIncomeChange,
      cumulativeInflation:
        amount > 0 ? ((futureCost - amount) / amount) * 100 : 0,
    };
  }, [amount, inflationRate, years, incomeGrowthRate]);

  function validateInputs() {
    if (amount < 0 || inflationRate < 0 || years < 0 || incomeGrowthRate < 0) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAmount(1000);
    setInflationRate(3);
    setYears(10);
    setIncomeGrowthRate(2);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate inflation impact
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate future prices, purchasing power loss and income-adjusted
          value using an annual inflation rate.
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
          <NumberInput label="Current amount" value={amount} onChange={setAmount} onBlur={validateInputs} />
          <NumberInput label="Annual inflation rate %" value={inflationRate} onChange={setInflationRate} onBlur={validateInputs} />
          <NumberInput label="Years" value={years} onChange={setYears} onBlur={validateInputs} />
          <NumberInput label="Annual income growth %" value={incomeGrowthRate} onChange={setIncomeGrowthRate} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Inflation estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Future cost" value={formatCurrency(result.futureCost, currency)} highlight />
            <ResultCard label="Purchasing power" value={formatCurrency(result.purchasingPower, currency)} />
            <ResultCard label="Total inflation impact" value={formatCurrency(result.totalInflation, currency)} />
            <ResultCard label="Cumulative inflation" value={`${result.cumulativeInflation.toFixed(2)}%`} />
            <ResultCard label="Income-adjusted amount" value={formatCurrency(result.incomeAdjustedAmount, currency)} />
            <ResultCard label="Real income change" value={`${result.realIncomeChange.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid inflation assumptions.
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