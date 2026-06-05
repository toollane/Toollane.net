"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function RoiCalculatorClient() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [additionalCosts, setAdditionalCosts] = useState(1500);
  const [revenue, setRevenue] = useState(18000);
  const [ongoingCosts, setOngoingCosts] = useState(3000);
  const [timeMonths, setTimeMonths] = useState(12);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      initialInvestment < 0 ||
      additionalCosts < 0 ||
      revenue < 0 ||
      ongoingCosts < 0 ||
      timeMonths <= 0
    ) {
      return null;
    }

    const totalInvestment = initialInvestment + additionalCosts + ongoingCosts;
    const netProfit = revenue - totalInvestment;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    const annualizedRoi =
      timeMonths > 0 ? (Math.pow(1 + roi / 100, 12 / timeMonths) - 1) * 100 : 0;
    const paybackMonths =
      revenue > ongoingCosts
        ? totalInvestment / ((revenue - ongoingCosts) / timeMonths)
        : null;

    return {
      totalInvestment,
      netProfit,
      roi,
      annualizedRoi,
      paybackMonths,
      profitMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
    };
  }, [initialInvestment, additionalCosts, revenue, ongoingCosts, timeMonths]);

  function validateInputs() {
    if (
      initialInvestment < 0 ||
      additionalCosts < 0 ||
      revenue < 0 ||
      ongoingCosts < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (timeMonths <= 0) {
      setError("Time period must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setInitialInvestment(10000);
    setAdditionalCosts(1500);
    setRevenue(18000);
    setOngoingCosts(3000);
    setTimeMonths(12);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate ROI
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate return on investment with revenue, initial investment,
          additional costs, ongoing costs and time period.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Initial investment"
            value={initialInvestment}
            onChange={setInitialInvestment}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Additional setup costs"
            value={additionalCosts}
            onChange={setAdditionalCosts}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Total revenue"
            value={revenue}
            onChange={setRevenue}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Ongoing costs"
            value={ongoingCosts}
            onChange={setOngoingCosts}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Time period months"
            value={timeMonths}
            onChange={setTimeMonths}
            onBlur={validateInputs}
          />
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
        <ToolResultBox title="ROI result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="ROI" value={formatPercent(result.roi)} highlight />
            <ResultCard
              label="Net profit"
              value={formatCurrency(result.netProfit)}
            />
            <ResultCard
              label="Total investment"
              value={formatCurrency(result.totalInvestment)}
            />
            <ResultCard
              label="Annualized ROI"
              value={formatPercent(result.annualizedRoi)}
            />
            <ResultCard
              label="Profit margin"
              value={formatPercent(result.profitMargin)}
            />
            <ResultCard
              label="Estimated payback"
              value={
                result.paybackMonths
                  ? `${result.paybackMonths.toFixed(1)} months`
                  : "Not reached"
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your estimated ROI is{" "}
            <strong className="text-black">{formatPercent(result.roi)}</strong>{" "}
            with a net profit of{" "}
            <strong className="text-black">
              {formatCurrency(result.netProfit)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid investment and revenue values to calculate ROI.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        ROI is useful for comparing investments, campaigns and projects, but it
        does not account for risk, cash flow timing, taxes or opportunity cost.
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