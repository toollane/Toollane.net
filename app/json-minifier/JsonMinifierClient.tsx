"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function JsonMinifierClient() {
  const [json, setJson] = useState(`{
  "name": "Toollane",
  "type": "micro-saas",
  "features": [
    "tools",
    "calculators",
    "converters"
  ],
  "active": true
}`);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const minified = JSON.stringify(parsed);
      const pretty = JSON.stringify(parsed, null, 2);
      const saved = json.length - minified.length;
      const reduction = json.length > 0 ? (saved / json.length) * 100 : 0;

      return {
        valid: true,
        minified,
        pretty,
        error: "",
        originalSize: json.length,
        minifiedSize: minified.length,
        saved,
        reduction,
      };
    } catch (error) {
      return {
        valid: false,
        minified: "",
        pretty: "",
        error: error instanceof Error ? error.message : "Invalid JSON.",
        originalSize: json.length,
        minifiedSize: 0,
        saved: 0,
        reduction: 0,
      };
    }
  }, [json]);

  async function copyResult() {
    if (result.valid) {
      await navigator.clipboard.writeText(result.minified);
    }
  }

  function resetExample() {
    setJson(`{
  "name": "Toollane",
  "type": "micro-saas",
  "features": [
    "tools",
    "calculators",
    "converters"
  ],
  "active": true
}`);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Minify JSON
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Validate and compress JSON by removing whitespace and formatting.
        </p>
      </div>

      <textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste JSON here..."
      />

      {!result.valid && <ToolErrorBox message={result.error} />}

      {result.valid ? (
        <ToolResultBox title="Minified JSON">
          <textarea
            readOnly
            value={result.minified}
            className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ResultCard label="Original size" value={`${result.originalSize.toLocaleString()} chars`} />
            <ResultCard label="Minified size" value={`${result.minifiedSize.toLocaleString()} chars`} />
            <ResultCard label="Saved" value={`${result.saved.toLocaleString()} chars`} />
            <ResultCard label="Reduction" value={`${result.reduction.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid JSON to generate a minified output.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          disabled={!result.valid}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Copy minified JSON
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
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}