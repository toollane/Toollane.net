"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ConversionRateCalculatorClient() {
  const [visitors, setVisitors] = useState(50000);
  const [conversions, setConversions] = useState(1250);
  const [targetConversionRate, setTargetConversionRate] = useState(4);
  const [averageOrderValue, setAverageOrderValue] = useState(49);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      visitors < 0 ||
      conversions < 0 ||
      targetConversionRate < 0 ||
      averageOrderValue < 0
    ) {
      return null;
    }

    const conversionRate = visitors > 0 ? (conversions / visitors) * 100 : 0;
    const targetConversions = visitors * (targetConversionRate / 100);
    const conversionGap = targetConversions - conversions;
    const revenue = conversions * averageOrderValue;
    const targetRevenue = targetConversions * averageOrderValue;
    const revenueGap = targetRevenue - revenue;

    return {
      conversionRate,
      targetConversions,
      conversionGap,
      revenue,
      targetRevenue,
      revenueGap,
    };
  }, [visitors, conversions, targetConversionRate, averageOrderValue]);

  function validateInputs() {
    if (
      visitors < 0 ||
      conversions < 0 ||
      targetConversionRate < 0 ||
      averageOrderValue < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setVisitors(50000);
    setConversions(1250);
    setTargetConversionRate(4);
    setAverageOrderValue(49);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate conversion rate
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Measure conversion rate, target conversions, revenue impact and the
          gap between current and target performance.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Visitors" value={visitors} onChange={setVisitors} onBlur={validateInputs} />
          <NumberInput label="Conversions" value={conversions} onChange={setConversions} onBlur={validateInputs} />
          <NumberInput label="Target conversion rate %" value={targetConversionRate} onChange={setTargetConversionRate} onBlur={validateInputs} />
          <NumberInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} onBlur={validateInputs} />
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
        <ToolResultBox title="Conversion result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Conversion rate" value={formatPercent(result.conversionRate)} highlight />
            <ResultCard label="Current conversions" value={formatNumber(conversions)} />
            <ResultCard label="Target conversions" value={formatNumber(result.targetConversions)} />
            <ResultCard label="Conversion gap" value={formatNumber(result.conversionGap)} />
            <ResultCard label="Current revenue" value={`$${formatNumber(result.revenue)}`} />
            <ResultCard label="Target revenue" value={`$${formatNumber(result.targetRevenue)}`} />
            <ResultCard label="Revenue gap" value={`$${formatNumber(result.revenueGap)}`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid visitor and conversion values to calculate conversion
          performance.
        </ToolInfoBox>
      )}
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
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}