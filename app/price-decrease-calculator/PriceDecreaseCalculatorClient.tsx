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

export default function PriceDecreaseCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [currentPrice, setCurrentPrice] = useState(49);
  const [decreasePercent, setDecreasePercent] = useState(15);
  const [unitsSold, setUnitsSold] = useState(1000);
  const [costPerUnit, setCostPerUnit] = useState(22);
  const [demandIncreasePercent, setDemandIncreasePercent] = useState(20);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      currentPrice < 0 ||
      decreasePercent < 0 ||
      decreasePercent > 100 ||
      unitsSold < 0 ||
      costPerUnit < 0 ||
      demandIncreasePercent < 0
    ) {
      return null;
    }

    const newPrice = currentPrice * (1 - decreasePercent / 100);
    const priceDifference = currentPrice - newPrice;
    const adjustedUnits = unitsSold * (1 + demandIncreasePercent / 100);

    const oldRevenue = currentPrice * unitsSold;
    const newRevenue = newPrice * adjustedUnits;
    const revenueChange = newRevenue - oldRevenue;

    const oldProfit = (currentPrice - costPerUnit) * unitsSold;
    const newProfit = (newPrice - costPerUnit) * adjustedUnits;
    const profitChange = newProfit - oldProfit;

    return {
      newPrice,
      priceDifference,
      adjustedUnits,
      oldRevenue,
      newRevenue,
      revenueChange,
      oldProfit,
      newProfit,
      profitChange,
      effectiveRevenueChange: oldRevenue > 0 ? (revenueChange / oldRevenue) * 100 : 0,
      effectiveProfitChange: oldProfit !== 0 ? (profitChange / oldProfit) * 100 : 0,
      breakEvenDemandIncrease:
        newPrice > 0 ? ((oldRevenue / newPrice - unitsSold) / unitsSold) * 100 : 0,
    };
  }, [currentPrice, decreasePercent, unitsSold, costPerUnit, demandIncreasePercent]);

  function validateInputs() {
    if (currentPrice < 0 || unitsSold < 0 || costPerUnit < 0 || demandIncreasePercent < 0) {
      setError("Values cannot be negative.");
      return false;
    }

    if (decreasePercent < 0 || decreasePercent > 100) {
      setError("Price decrease must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setCurrentPrice(49);
    setDecreasePercent(15);
    setUnitsSold(1000);
    setCostPerUnit(22);
    setDemandIncreasePercent(20);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate price decrease impact
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how a price decrease affects revenue, profit and required
          demand growth.
        </p>
      </div>

      <div className="grid gap-5">
        <CurrencySelect currency={currency} setCurrency={setCurrency} />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Current price" value={currentPrice} onChange={setCurrentPrice} onBlur={validateInputs} />
          <NumberInput label="Price decrease %" value={decreasePercent} onChange={setDecreasePercent} onBlur={validateInputs} />
          <NumberInput label="Units sold before decrease" value={unitsSold} onChange={setUnitsSold} onBlur={validateInputs} />
          <NumberInput label="Cost per unit" value={costPerUnit} onChange={setCostPerUnit} onBlur={validateInputs} />
          <NumberInput label="Expected demand increase %" value={demandIncreasePercent} onChange={setDemandIncreasePercent} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Price decrease result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="New price" value={formatCurrency(result.newPrice, currency)} highlight />
            <ResultCard label="Price decrease amount" value={formatCurrency(result.priceDifference, currency)} />
            <ResultCard label="Adjusted units sold" value={Math.round(result.adjustedUnits).toLocaleString()} />
            <ResultCard label="Break-even demand increase" value={formatPercent(result.breakEvenDemandIncrease)} />
            <ResultCard label="Old revenue" value={formatCurrency(result.oldRevenue, currency)} />
            <ResultCard label="New revenue" value={formatCurrency(result.newRevenue, currency)} />
            <ResultCard label="Revenue change" value={formatCurrency(result.revenueChange, currency)} />
            <ResultCard label="Revenue change %" value={formatPercent(result.effectiveRevenueChange)} />
            <ResultCard label="Old profit" value={formatCurrency(result.oldProfit, currency)} />
            <ResultCard label="New profit" value={formatCurrency(result.newProfit, currency)} />
            <ResultCard label="Profit change" value={formatCurrency(result.profitChange, currency)} />
            <ResultCard label="Profit change %" value={formatPercent(result.effectiveProfitChange)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid values to calculate the impact of a price decrease.
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