"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type SolveFor = "width" | "height";

const PRESETS = [
  { label: "16:9 — YouTube / widescreen", w: 16, h: 9 },
  { label: "9:16 — Shorts / Reels / TikTok", w: 9, h: 16 },
  { label: "1:1 — Square post", w: 1, h: 1 },
  { label: "4:5 — Instagram portrait", w: 4, h: 5 },
  { label: "3:2 — Photography", w: 3, h: 2 },
  { label: "4:3 — Classic screen", w: 4, h: 3 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioCalculatorClient() {
  const [ratioWidth, setRatioWidth] = useState(16);
  const [ratioHeight, setRatioHeight] = useState(9);
  const [knownWidth, setKnownWidth] = useState(1920);
  const [knownHeight, setKnownHeight] = useState(1080);
  const [solveFor, setSolveFor] = useState<SolveFor>("height");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (ratioWidth <= 0 || ratioHeight <= 0 || knownWidth <= 0 || knownHeight <= 0) {
      return null;
    }

    const simplifiedGcd = gcd(Math.round(ratioWidth), Math.round(ratioHeight));
    const simplifiedWidth = ratioWidth / simplifiedGcd;
    const simplifiedHeight = ratioHeight / simplifiedGcd;

    const calculatedWidth = solveFor === "width"
      ? Math.round(knownHeight * (ratioWidth / ratioHeight))
      : knownWidth;

    const calculatedHeight = solveFor === "height"
      ? Math.round(knownWidth * (ratioHeight / ratioWidth))
      : knownHeight;

    return {
      simplified: `${simplifiedWidth}:${simplifiedHeight}`,
      decimal: ratioWidth / ratioHeight,
      calculatedWidth,
      calculatedHeight,
      cssAspectRatio: `${simplifiedWidth} / ${simplifiedHeight}`,
      paddingTop: `${((ratioHeight / ratioWidth) * 100).toFixed(4)}%`,
    };
  }, [ratioWidth, ratioHeight, knownWidth, knownHeight, solveFor]);

  function validateInputs() {
    if (ratioWidth <= 0 || ratioHeight <= 0 || knownWidth <= 0 || knownHeight <= 0) {
      setError("All values must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function applyPreset(width: number, height: number) {
    setRatioWidth(width);
    setRatioHeight(height);
    setError("");
  }

  async function copyCss() {
    if (!result) return;
    await navigator.clipboard.writeText(`aspect-ratio: ${result.cssAspectRatio};`);
  }

  function resetExample() {
    setRatioWidth(16);
    setRatioHeight(9);
    setKnownWidth(1920);
    setKnownHeight(1080);
    setSolveFor("height");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate aspect ratio
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate missing width or height, simplify ratios and generate CSS
          aspect-ratio values for images, videos and layouts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Ratio width" value={ratioWidth} onChange={setRatioWidth} onBlur={validateInputs} />
        <NumberInput label="Ratio height" value={ratioHeight} onChange={setRatioHeight} onBlur={validateInputs} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset.w, preset.h)}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-xs font-bold text-black transition hover:bg-black/5"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Calculate</span>

        <select
          value={solveFor}
          onChange={(event) => setSolveFor(event.target.value as SolveFor)}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        >
          <option value="height">Height from width</option>
          <option value="width">Width from height</option>
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Known width" value={knownWidth} onChange={setKnownWidth} onBlur={validateInputs} />
        <NumberInput label="Known height" value={knownHeight} onChange={setKnownHeight} onBlur={validateInputs} />
      </div>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <ToolResultBox title="Aspect ratio result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Final size" value={`${result.calculatedWidth} × ${result.calculatedHeight}`} highlight />
            <ResultCard label="Simplified ratio" value={result.simplified} />
            <ResultCard label="Decimal ratio" value={result.decimal.toFixed(6)} />
            <ResultCard label="CSS aspect-ratio" value={result.cssAspectRatio} />
            <ResultCard label="Padding-top fallback" value={result.paddingTop} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid dimensions to calculate aspect ratio.</ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyCss} disabled={!result} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
          Copy CSS
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>
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
      <div className="mt-2 break-words text-xl font-black">{value}</div>
    </div>
  );
}