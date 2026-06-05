"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Mode =
  | "percent-of"
  | "what-percent"
  | "increase-decrease"
  | "percentage-change";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>("percent-of");
  const [valueA, setValueA] = useState(25);
  const [valueB, setValueB] = useState(200);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!Number.isFinite(valueA) || !Number.isFinite(valueB)) {
      return null;
    }

    if (mode === "percent-of") {
      return {
        main: (valueA / 100) * valueB,
        label: `${valueA}% of ${valueB}`,
        explanation: `${valueA}% of ${valueB} equals ${(valueA / 100) * valueB}.`,
      };
    }

    if (mode === "what-percent") {
      if (valueB === 0) return null;

      return {
        main: (valueA / valueB) * 100,
        label: `${valueA} as a percentage of ${valueB}`,
        explanation: `${valueA} is ${((valueA / valueB) * 100).toFixed(2)}% of ${valueB}.`,
      };
    }

    if (mode === "increase-decrease") {
      const increased = valueB * (1 + valueA / 100);
      const decreased = valueB * (1 - valueA / 100);

      return {
        main: increased,
        secondary: decreased,
        label: `${valueB} increased or decreased by ${valueA}%`,
        explanation: `${valueB} increased by ${valueA}% is ${increased}. Decreased by ${valueA}% is ${decreased}.`,
      };
    }

    if (valueA === 0) return null;

    const change = valueB - valueA;

    return {
      main: (change / valueA) * 100,
      secondary: change,
      label: `Percentage change from ${valueA} to ${valueB}`,
      explanation: `The change from ${valueA} to ${valueB} is ${change}, or ${((change / valueA) * 100).toFixed(2)}%.`,
    };
  }, [mode, valueA, valueB]);

  function validateInputs() {
    if (!Number.isFinite(valueA) || !Number.isFinite(valueB)) {
      setError("Please enter valid numbers.");
      return false;
    }

    if ((mode === "what-percent" && valueB === 0) || (mode === "percentage-change" && valueA === 0)) {
      setError("This calculation cannot divide by zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setMode("percent-of");
    setValueA(25);
    setValueB(200);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate percentages
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate percentages, percentage of a number, percentage change,
          increases and decreases.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Calculation type</span>

          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              setError("");
            }}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="percent-of">What is A% of B?</option>
            <option value="what-percent">A is what percent of B?</option>
            <option value="increase-decrease">Increase / decrease B by A%</option>
            <option value="percentage-change">Percentage change from A to B</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label={mode === "percent-of" || mode === "increase-decrease" ? "Percentage A" : "Value A"} value={valueA} onChange={setValueA} onBlur={validateInputs} />
          <NumberInput label="Value B" value={valueB} onChange={setValueB} onBlur={validateInputs} />
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
        <ToolResultBox title="Percentage result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label={result.label}
              value={
                mode === "what-percent" || mode === "percentage-change"
                  ? formatPercent(result.main)
                  : formatNumber(result.main)
              }
              highlight
            />

            {typeof result.secondary === "number" && (
              <ResultCard
                label={mode === "increase-decrease" ? "Decreased result" : "Absolute change"}
                value={formatNumber(result.secondary)}
              />
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            {result.explanation}
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid values to calculate percentages. Avoid zero when it would
          require division by zero.
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