"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type SortMode = "none" | "asc" | "desc";

function generateRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateStats(numbers: number[]) {
  const sum = numbers.reduce((total, number) => total + number, 0);
  const average = numbers.length ? sum / numbers.length : 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const median =
    sorted.length === 0
      ? 0
      : sorted.length % 2
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

  return {
    sum,
    average,
    median,
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
  };
}

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("none");
  const [separator, setSeparator] = useState(", ");
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (min > max || count <= 0) {
      return null;
    }

    const rangeSize = max - min + 1;

    if (!allowDuplicates && count > rangeSize) {
      return null;
    }

    let numbers: number[] = [];

    if (allowDuplicates) {
      numbers = Array.from({ length: count }, () => generateRandomInteger(min, max));
    } else {
      const pool = Array.from({ length: rangeSize }, (_, index) => min + index);

      for (let index = pool.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
      }

      numbers = pool.slice(0, count);
    }

    if (sortMode === "asc") {
      numbers.sort((a, b) => a - b);
    }

    if (sortMode === "desc") {
      numbers.sort((a, b) => b - a);
    }

    const stats = calculateStats(numbers);

    return {
      numbers,
      output: numbers.join(separator),
      stats,
    };
  }, [min, max, count, allowDuplicates, sortMode, separator, refreshKey]);

  function validateInputs() {
    if (min > max) {
      setError("Minimum cannot be greater than maximum.");
      return false;
    }

    if (count <= 0) {
      setError("Count must be greater than zero.");
      return false;
    }

    if (count > 10000) {
      setError("Count is too high. Use 10,000 or fewer numbers.");
      return false;
    }

    if (!allowDuplicates && count > max - min + 1) {
      setError("Count cannot exceed the number range when duplicates are disabled.");
      return false;
    }

    setError("");
    return true;
  }

  function generateAgain() {
    if (validateInputs()) {
      setRefreshKey((current) => current + 1);
    }
  }

  async function copyNumbers() {
    if (!result) return;
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setMin(1);
    setMax(100);
    setCount(10);
    setAllowDuplicates(true);
    setSortMode("none");
    setSeparator(", ");
    setRefreshKey((current) => current + 1);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate random numbers
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate random numbers with custom ranges, duplicate control,
          sorting, separators and basic statistics.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput label="Minimum" value={min} onChange={setMin} onBlur={validateInputs} />
          <NumberInput label="Maximum" value={max} onChange={setMax} onBlur={validateInputs} />
          <NumberInput label="Count" value={count} onChange={setCount} onBlur={validateInputs} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Sort result</span>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="none">Do not sort</option>
              <option value="asc">Low to high</option>
              <option value="desc">High to low</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Separator</span>

            <input
              value={separator}
              onChange={(event) => setSeparator(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        </div>

        <Toggle label="Allow duplicates" checked={allowDuplicates} onChange={setAllowDuplicates} />

        {error && <ToolErrorBox message={error} />}
      </div>

      {result ? (
        <ToolResultBox title="Generated numbers">
          <textarea
            readOnly
            value={result.output}
            className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ResultCard label="Count" value={result.numbers.length.toLocaleString()} />
            <ResultCard label="Minimum picked" value={result.stats.min.toLocaleString()} />
            <ResultCard label="Maximum picked" value={result.stats.max.toLocaleString()} />
            <ResultCard label="Sum" value={result.stats.sum.toLocaleString()} />
            <ResultCard label="Average" value={result.stats.average.toFixed(2)} />
            <ResultCard label="Median" value={result.stats.median.toFixed(2)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter a valid range and count to generate numbers.</ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={generateAgain} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Generate again
        </button>

        <button type="button" onClick={copyNumbers} disabled={!result} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50">
          Copy numbers
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">{label}</div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}