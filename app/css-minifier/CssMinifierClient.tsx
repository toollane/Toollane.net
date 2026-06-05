"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function minifyCss(css: string, removeComments: boolean) {
  let output = css;

  if (removeComments) {
    output = output.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  return output
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

export default function CssMinifierClient() {
  const [css, setCss] = useState(`/* Example CSS */
.card {
  background: white;
  border-radius: 24px;
  padding: 24px;
}

.card:hover {
  transform: translateY(-2px);
}`);
  const [removeComments, setRemoveComments] = useState(true);

  const result = useMemo(() => {
    const minified = minifyCss(css, removeComments);
    const saved = css.length - minified.length;
    const reduction = css.length > 0 ? (saved / css.length) * 100 : 0;

    const ruleCount = (css.match(/{/g) || []).length;
    const selectorCount = css
      .split("{")
      .slice(0, -1)
      .map((item) => item.split("}").pop()?.trim())
      .filter(Boolean).length;

    return {
      minified,
      originalSize: css.length,
      minifiedSize: minified.length,
      saved,
      reduction,
      ruleCount,
      selectorCount,
    };
  }, [css, removeComments]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.minified);
  }

  function resetExample() {
    setCss(`/* Example CSS */
.card {
  background: white;
  border-radius: 24px;
  padding: 24px;
}

.card:hover {
  transform: translateY(-2px);
}`);
    setRemoveComments(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Minify CSS
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compress CSS by removing comments, whitespace and unnecessary
          formatting.
        </p>
      </div>

      <Toggle label="Remove comments" checked={removeComments} onChange={setRemoveComments} />

      <textarea
        value={css}
        onChange={(event) => setCss(event.target.value)}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste CSS here..."
      />

      <ToolResultBox title="Minified CSS">
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
          <ResultCard label="Rules" value={result.ruleCount.toLocaleString()} />
          <ResultCard label="Selectors" value={result.selectorCount.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy minified CSS
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        CSS minification can reduce file size and improve loading performance.
        For production apps, combine this with a build pipeline and caching.
      </ToolInfoBox>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-black" />
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