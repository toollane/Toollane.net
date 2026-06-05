"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function minifyJavascript(code: string, removeComments: boolean) {
  let output = code;

  if (removeComments) {
    output = output
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
  }

  return output
    .replace(/\s+/g, " ")
    .replace(/\s*([{}()[\]=:+\-*/%,;<>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export default function JavascriptMinifierClient() {
  const [code, setCode] = useState(`// Example JavaScript
function calculateTotal(price, quantity) {
  const total = price * quantity;

  return total;
}

console.log(calculateTotal(19.99, 3));
`);

  const [removeComments, setRemoveComments] = useState(true);

  const result = useMemo(() => {
    const minified = minifyJavascript(code, removeComments);
    const saved = code.length - minified.length;
    const reduction = code.length > 0 ? (saved / code.length) * 100 : 0;

    return {
      minified,
      originalSize: code.length,
      minifiedSize: minified.length,
      saved,
      reduction,
      lines: code ? code.split("\n").length : 0,
    };
  }, [code, removeComments]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.minified);
  }

  function resetExample() {
    setCode(`// Example JavaScript
function calculateTotal(price, quantity) {
  const total = price * quantity;

  return total;
}

console.log(calculateTotal(19.99, 3));
`);
    setRemoveComments(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Minify JavaScript
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compress JavaScript by removing comments, extra whitespace and
          unnecessary formatting.
        </p>
      </div>

      <Toggle
        label="Remove comments"
        checked={removeComments}
        onChange={setRemoveComments}
      />

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste JavaScript here..."
      />

      <ToolResultBox title="Minified JavaScript">
        <textarea
          readOnly
          value={result.minified}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Original size" value={`${result.originalSize.toLocaleString()} chars`} />
          <ResultCard label="Minified size" value={`${result.minifiedSize.toLocaleString()} chars`} />
          <ResultCard label="Saved" value={`${result.saved.toLocaleString()} chars`} />
          <ResultCard label="Reduction" value={`${result.reduction.toFixed(2)}%`} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy minified JS
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        This lightweight browser minifier is useful for quick cleanup. For
        production builds, use a dedicated bundler or minification pipeline.
      </ToolInfoBox>
    </div>
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
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}