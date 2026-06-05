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

export default function YoutubeCpmCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [adRevenue, setAdRevenue] = useState(2500);
  const [views, setViews] = useState(500000);
  const [monetizedViews, setMonetizedViews] = useState(275000);
  const [estimatedCreatorShare, setEstimatedCreatorShare] = useState(55);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      adRevenue < 0 ||
      views < 0 ||
      monetizedViews < 0 ||
      estimatedCreatorShare < 0 ||
      estimatedCreatorShare > 100
    ) {
      return null;
    }

    const rpm = views > 0 ? (adRevenue / views) * 1000 : 0;
    const playbackCpm = monetizedViews > 0 ? (adRevenue / monetizedViews) * 1000 : 0;
    const grossAdvertiserCpm =
      estimatedCreatorShare > 0 ? playbackCpm / (estimatedCreatorShare / 100) : 0;
    const monetizationRate = views > 0 ? (monetizedViews / views) * 100 : 0;

    return {
      rpm,
      playbackCpm,
      grossAdvertiserCpm,
      monetizationRate,
    };
  }, [adRevenue, views, monetizedViews, estimatedCreatorShare]);

  function validateInputs() {
    if (adRevenue < 0 || views < 0 || monetizedViews < 0) {
      setError("Values cannot be negative.");
      return false;
    }

    if (estimatedCreatorShare < 0 || estimatedCreatorShare > 100) {
      setError("Creator share must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAdRevenue(2500);
    setViews(500000);
    setMonetizedViews(275000);
    setEstimatedCreatorShare(55);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate YouTube CPM
        </h2>
        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate RPM, playback CPM, estimated advertiser CPM and monetization
          rate from YouTube views and revenue.
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
          <NumberInput label="Creator ad revenue" value={adRevenue} onChange={setAdRevenue} onBlur={validateInputs} />
          <NumberInput label="Total views" value={views} onChange={setViews} onBlur={validateInputs} />
          <NumberInput label="Monetized views" value={monetizedViews} onChange={setMonetizedViews} onBlur={validateInputs} />
          <NumberInput label="Estimated creator share %" value={estimatedCreatorShare} onChange={setEstimatedCreatorShare} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="YouTube CPM result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="RPM" value={formatCurrency(result.rpm, currency)} highlight />
            <ResultCard label="Playback CPM" value={formatCurrency(result.playbackCpm, currency)} />
            <ResultCard label="Estimated advertiser CPM" value={formatCurrency(result.grossAdvertiserCpm, currency)} />
            <ResultCard label="Monetization rate" value={formatPercent(result.monetizationRate)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid YouTube revenue and view values.</ToolInfoBox>
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