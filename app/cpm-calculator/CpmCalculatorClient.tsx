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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function CpmCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [adSpend, setAdSpend] = useState(2500);
  const [impressions, setImpressions] = useState(500000);
  const [reach, setReach] = useState(180000);
  const [clicks, setClicks] = useState(4500);
  const [conversions, setConversions] = useState(180);
  const [revenue, setRevenue] = useState(9000);
  const [targetCpm, setTargetCpm] = useState(5);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      adSpend < 0 ||
      impressions < 0 ||
      reach < 0 ||
      clicks < 0 ||
      conversions < 0 ||
      revenue < 0 ||
      targetCpm < 0
    ) {
      return null;
    }

    const cpm = impressions > 0 ? (adSpend / impressions) * 1000 : 0;
    const frequency = reach > 0 ? impressions / reach : 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? adSpend / clicks : 0;
    const cpa = conversions > 0 ? adSpend / conversions : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const roas = adSpend > 0 ? revenue / adSpend : 0;
    const profit = revenue - adSpend;
    const impressionsAtTargetCpm =
      targetCpm > 0 ? (adSpend / targetCpm) * 1000 : 0;

    return {
      cpm,
      frequency,
      ctr,
      cpc,
      cpa,
      conversionRate,
      roas,
      profit,
      impressionsAtTargetCpm,
    };
  }, [
    adSpend,
    impressions,
    reach,
    clicks,
    conversions,
    revenue,
    targetCpm,
  ]);

  function validateInputs() {
    if (
      adSpend < 0 ||
      impressions < 0 ||
      reach < 0 ||
      clicks < 0 ||
      conversions < 0 ||
      revenue < 0 ||
      targetCpm < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAdSpend(2500);
    setImpressions(500000);
    setReach(180000);
    setClicks(4500);
    setConversions(180);
    setRevenue(9000);
    setTargetCpm(5);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate CPM and ad reach
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate cost per thousand impressions, frequency, CTR, CPC, CPA,
          ROAS and profit from campaign performance data.
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
          <NumberInput label="Ad spend" value={adSpend} onChange={setAdSpend} onBlur={validateInputs} />
          <NumberInput label="Impressions" value={impressions} onChange={setImpressions} onBlur={validateInputs} />
          <NumberInput label="Reach" value={reach} onChange={setReach} onBlur={validateInputs} />
          <NumberInput label="Clicks" value={clicks} onChange={setClicks} onBlur={validateInputs} />
          <NumberInput label="Conversions" value={conversions} onChange={setConversions} onBlur={validateInputs} />
          <NumberInput label="Revenue from campaign" value={revenue} onChange={setRevenue} onBlur={validateInputs} />
          <NumberInput label="Target CPM" value={targetCpm} onChange={setTargetCpm} onBlur={validateInputs} />
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
        <ToolResultBox title="CPM result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="CPM" value={formatCurrency(result.cpm, currency)} highlight />
            <ResultCard label="Frequency" value={`${result.frequency.toFixed(2)}x`} />
            <ResultCard label="CTR" value={formatPercent(result.ctr)} />
            <ResultCard label="CPC" value={formatCurrency(result.cpc, currency)} />
            <ResultCard label="CPA" value={formatCurrency(result.cpa, currency)} />
            <ResultCard label="Conversion rate" value={formatPercent(result.conversionRate)} />
            <ResultCard label="ROAS" value={`${result.roas.toFixed(2)}x`} />
            <ResultCard label="Profit" value={formatCurrency(result.profit, currency)} />
            <ResultCard label="Impressions at target CPM" value={formatNumber(result.impressionsAtTargetCpm)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your CPM is{" "}
            <strong className="text-black">
              {formatCurrency(result.cpm, currency)}
            </strong>{" "}
            and your campaign frequency is{" "}
            <strong className="text-black">
              {result.frequency.toFixed(2)}x
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid campaign values to calculate CPM and reach metrics.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        CPM is useful for awareness campaigns, but it should be evaluated
        alongside reach, frequency, CTR, CPA and ROAS.
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