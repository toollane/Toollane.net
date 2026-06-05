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

export default function CreatorRateCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [hours, setHours] = useState(8);
  const [desiredHourlyRate, setDesiredHourlyRate] = useState(75);
  const [productionCost, setProductionCost] = useState(200);
  const [platformFeePercent, setPlatformFeePercent] = useState(10);
  const [taxPercent, setTaxPercent] = useState(20);
  const [profitMarginPercent, setProfitMarginPercent] = useState(25);
  const [usageRightsFee, setUsageRightsFee] = useState(400);
  const [rushFeePercent, setRushFeePercent] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      hours < 0 ||
      desiredHourlyRate < 0 ||
      productionCost < 0 ||
      platformFeePercent < 0 ||
      platformFeePercent > 100 ||
      taxPercent < 0 ||
      taxPercent > 100 ||
      profitMarginPercent < 0 ||
      usageRightsFee < 0 ||
      rushFeePercent < 0
    ) {
      return null;
    }

    const laborCost = hours * desiredHourlyRate;
    const subtotal = laborCost + productionCost + usageRightsFee;
    const profit = subtotal * (profitMarginPercent / 100);
    const rushFee = (subtotal + profit) * (rushFeePercent / 100);
    const beforeFees = subtotal + profit + rushFee;
    const platformFee = beforeFees * (platformFeePercent / 100);
    const taxReserve = beforeFees * (taxPercent / 100);
    const recommendedRate = beforeFees + platformFee + taxReserve;

    return {
      laborCost,
      subtotal,
      profit,
      rushFee,
      platformFee,
      taxReserve,
      recommendedRate,
      dayRate: desiredHourlyRate * 8,
      effectiveHourly: hours > 0 ? recommendedRate / hours : 0,
    };
  }, [
    hours,
    desiredHourlyRate,
    productionCost,
    platformFeePercent,
    taxPercent,
    profitMarginPercent,
    usageRightsFee,
    rushFeePercent,
  ]);

  function validateInputs() {
    if (
      hours < 0 ||
      desiredHourlyRate < 0 ||
      productionCost < 0 ||
      usageRightsFee < 0 ||
      rushFeePercent < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (
      platformFeePercent > 100 ||
      taxPercent > 100 ||
      platformFeePercent < 0 ||
      taxPercent < 0
    ) {
      setError("Fee and tax percentages must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setHours(8);
    setDesiredHourlyRate(75);
    setProductionCost(200);
    setPlatformFeePercent(10);
    setTaxPercent(20);
    setProfitMarginPercent(25);
    setUsageRightsFee(400);
    setRushFeePercent(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate creator rates
        </h2>
        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Price creator work with labor time, hourly rate, production costs,
          platform fees, taxes, profit margin, usage rights and rush fees.
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
          <NumberInput label="Project hours" value={hours} onChange={setHours} onBlur={validateInputs} />
          <NumberInput label="Desired hourly rate" value={desiredHourlyRate} onChange={setDesiredHourlyRate} onBlur={validateInputs} />
          <NumberInput label="Production costs" value={productionCost} onChange={setProductionCost} onBlur={validateInputs} />
          <NumberInput label="Platform fee %" value={platformFeePercent} onChange={setPlatformFeePercent} onBlur={validateInputs} />
          <NumberInput label="Tax reserve %" value={taxPercent} onChange={setTaxPercent} onBlur={validateInputs} />
          <NumberInput label="Profit margin %" value={profitMarginPercent} onChange={setProfitMarginPercent} onBlur={validateInputs} />
          <NumberInput label="Usage rights fee" value={usageRightsFee} onChange={setUsageRightsFee} onBlur={validateInputs} />
          <NumberInput label="Rush fee %" value={rushFeePercent} onChange={setRushFeePercent} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Creator rate estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Recommended rate" value={formatCurrency(result.recommendedRate, currency)} highlight />
            <ResultCard label="Effective hourly" value={formatCurrency(result.effectiveHourly, currency)} />
            <ResultCard label="Labor cost" value={formatCurrency(result.laborCost, currency)} />
            <ResultCard label="Production cost" value={formatCurrency(productionCost, currency)} />
            <ResultCard label="Usage rights" value={formatCurrency(usageRightsFee, currency)} />
            <ResultCard label="Profit" value={formatCurrency(result.profit, currency)} />
            <ResultCard label="Platform fee" value={formatCurrency(result.platformFee, currency)} />
            <ResultCard label="Tax reserve" value={formatCurrency(result.taxReserve, currency)} />
            <ResultCard label="Day rate baseline" value={formatCurrency(result.dayRate, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid creator project values.</ToolInfoBox>
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