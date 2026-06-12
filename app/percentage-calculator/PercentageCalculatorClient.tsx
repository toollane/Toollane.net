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

type Example = {
  label: string;
  mode: Mode;
  valueA: number;
  valueB: number;
};

const examples: Example[] = [
  {
    label: "25% of 200",
    mode: "percent-of",
    valueA: 25,
    valueB: 200,
  },
  {
    label: "50 is what % of 200?",
    mode: "what-percent",
    valueA: 50,
    valueB: 200,
  },
  {
    label: "Increase 200 by 15%",
    mode: "increase-decrease",
    valueA: 15,
    valueB: 200,
  },
  {
    label: "Change from 80 to 100",
    mode: "percentage-change",
    valueA: 80,
    valueB: 100,
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function getFormula(mode: Mode) {
  if (mode === "percent-of") {
    return "(A ÷ 100) × B";
  }

  if (mode === "what-percent") {
    return "(A ÷ B) × 100";
  }

  if (mode === "increase-decrease") {
    return "B × (1 ± A ÷ 100)";
  }

  return "((B - A) ÷ A) × 100";
}

function getModeHelp(mode: Mode) {
  if (mode === "percent-of") {
    return "Use this when you want to know what a percentage of a number equals.";
  }

  if (mode === "what-percent") {
    return "Use this when you want to know what percentage one value is of another value.";
  }

  if (mode === "increase-decrease") {
    return "Use this when you want to increase or decrease a number by a percentage.";
  }

  return "Use this when you want to calculate the percentage change from an old value to a new value.";
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>("percent-of");
  const [valueA, setValueA] = useState("25");
  const [valueB, setValueB] = useState("200");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const numberA = Number(valueA);
  const numberB = Number(valueB);

  const result = useMemo(() => {
    if (!Number.isFinite(numberA) || !Number.isFinite(numberB)) {
      return null;
    }

    if (mode === "percent-of") {
      const main = (numberA / 100) * numberB;

      return {
        main,
        label: `${numberA}% of ${numberB}`,
        displayValue: formatNumber(main),
        explanation: `${numberA}% of ${numberB} equals ${formatNumber(main)}.`,
        copyText: `${numberA}% of ${numberB} = ${formatNumber(main)}`,
      };
    }

    if (mode === "what-percent") {
      if (numberB === 0) return null;

      const main = (numberA / numberB) * 100;

      return {
        main,
        label: `${numberA} as a percentage of ${numberB}`,
        displayValue: formatPercent(main),
        explanation: `${numberA} is ${formatPercent(main)} of ${numberB}.`,
        copyText: `${numberA} is ${formatPercent(main)} of ${numberB}`,
      };
    }

    if (mode === "increase-decrease") {
      const increased = numberB * (1 + numberA / 100);
      const decreased = numberB * (1 - numberA / 100);

      return {
        main: increased,
        secondary: decreased,
        label: `${numberB} increased by ${numberA}%`,
        secondaryLabel: `${numberB} decreased by ${numberA}%`,
        displayValue: formatNumber(increased),
        secondaryDisplayValue: formatNumber(decreased),
        explanation: `${numberB} increased by ${numberA}% is ${formatNumber(
          increased
        )}. ${numberB} decreased by ${numberA}% is ${formatNumber(decreased)}.`,
        copyText: `${numberB} increased by ${numberA}% = ${formatNumber(
          increased
        )}\n${numberB} decreased by ${numberA}% = ${formatNumber(decreased)}`,
      };
    }

    if (numberA === 0) return null;

    const change = numberB - numberA;
    const percentageChange = (change / numberA) * 100;

    return {
      main: percentageChange,
      secondary: change,
      label: `Percentage change from ${numberA} to ${valueB}`,
      secondaryLabel: "Absolute change",
      displayValue: formatPercent(percentageChange),
      secondaryDisplayValue: formatNumber(change),
      explanation: `The change from ${numberA} to ${valueB} is ${formatNumber(
        change
      )}, or ${formatPercent(percentageChange)}.`,
      copyText: `Percentage change from ${numberA} to ${valueB} = ${formatPercent(
        percentageChange
      )}\nAbsolute change = ${formatNumber(change)}`,
    };
  }, [mode, numberA, valueB]);

  function validateInputs() {
    setCopied(false);

    if (!Number.isFinite(valueA) || !Number.isFinite(valueB)) {
      setError("Please enter valid numbers.");
      return false;
    }

    if (
      (mode === "what-percent" && numberB === 0) ||
      (mode === "percentage-change" && numberA === 0)
    ) {
      setError("This calculation cannot divide by zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setMode("percent-of");
    setValueA("25");
    setValueB("200");
    setError("");
    setCopied(false);
  }

  function applyExample(example: Example) {
    setMode(example.mode);
    setValueA(String(example.valueA));
    setValueB(String(example.valueB));
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) {
      setError("Enter valid values before copying a result.");
      return;
    }

    await navigator.clipboard.writeText(result.copyText);
    setError("");
    setCopied(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate percentages
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Choose a calculation type, enter your values and get an instant
          percentage result with the formula and explanation.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
        <h3 className="text-lg font-black text-black">Quick examples</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => applyExample(example)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-bold text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Calculation type
          </span>

          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as Mode);
              setError("");
              setCopied(false);
            }}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="percent-of">What is A% of B?</option>
            <option value="what-percent">A is what percent of B?</option>
            <option value="increase-decrease">
              Increase / decrease B by A%
            </option>
            <option value="percentage-change">
              Percentage change from A to B
            </option>
          </select>

          <p className="mt-3 text-sm leading-6 text-black/55">
            {getModeHelp(mode)}
          </p>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label={
              mode === "percent-of" || mode === "increase-decrease"
                ? "Percentage A"
                : "Value A"
            }
            value={valueA}
            onChange={setValueA}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Value B"
            value={valueB}
            onChange={setValueB}
            onBlur={validateInputs}
          />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-black/40">
            Formula
          </div>

          <div className="mt-2 font-mono text-lg font-black text-black">
            {getFormula(mode)}
          </div>
        </div>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={copyResult}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            {copied ? "Copied result" : "Copy result"}
          </button>

          <button
            type="button"
            onClick={resetExample}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Reset example
          </button>
        </div>
      </div>

      {result ? (
        <ToolResultBox title="Percentage result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label={result.label}
              value={result.displayValue}
              highlight
            />

            {typeof result.secondary === "number" &&
              result.secondaryLabel &&
              result.secondaryDisplayValue && (
                <ResultCard
                  label={result.secondaryLabel}
                  value={result.secondaryDisplayValue}
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
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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