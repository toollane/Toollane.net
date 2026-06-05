"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function minifyHtml(
  html: string,
  removeComments: boolean,
  collapseWhitespace: boolean
) {
  let output = html;

  if (removeComments) {
    output = output.replace(/<!--[\s\S]*?-->/g, "");
  }

  if (collapseWhitespace) {
    output = output
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  }

  return output;
}

export default function HtmlMinifierClient() {
  const [html, setHtml] = useState(`<!doctype html>
<html>
  <head>
    <!-- Example comment -->
    <title>Example Page</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <p>This is example HTML.</p>
  </body>
</html>`);

  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);

  const result = useMemo(() => {
    const minified = minifyHtml(html, removeComments, collapseWhitespace);
    const saved = html.length - minified.length;
    const reduction = html.length > 0 ? (saved / html.length) * 100 : 0;

    return {
      minified,
      originalSize: html.length,
      minifiedSize: minified.length,
      saved,
      reduction,
    };
  }, [html, removeComments, collapseWhitespace]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.minified);
  }

  function resetExample() {
    setHtml(`<!doctype html>
<html>
  <head>
    <!-- Example comment -->
    <title>Example Page</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <p>This is example HTML.</p>
  </body>
</html>`);
    setRemoveComments(true);
    setCollapseWhitespace(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Minify HTML
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Reduce HTML size by removing comments, extra whitespace and line
          breaks.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Remove comments" checked={removeComments} onChange={setRemoveComments} />
        <Toggle label="Collapse whitespace" checked={collapseWhitespace} onChange={setCollapseWhitespace} />
      </div>

      <textarea
        value={html}
        onChange={(event) => setHtml(event.target.value)}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste HTML here..."
      />

      <ToolResultBox title="Minified HTML">
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
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy minified HTML
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        This browser-based minifier is intended for quick cleanup and size
        reduction. For production build pipelines, dedicated build tools can
        provide deeper optimization.
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