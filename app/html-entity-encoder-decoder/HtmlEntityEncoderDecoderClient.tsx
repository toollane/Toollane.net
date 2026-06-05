"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Mode = "encode" | "decode";

function encodeHtmlEntities(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#47;");
}

function decodeHtmlEntities(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export default function HtmlEntityEncoderDecoderClient() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState(`<div class="example">Tom & Jerry's "HTML"</div>`);

  const result = useMemo(() => {
    const output =
      mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);

    return {
      output,
      inputCharacters: input.length,
      outputCharacters: output.length,
      entities: (output.match(/&[#a-zA-Z0-9]+;/g) || []).length,
    };
  }, [input, mode]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setMode("encode");
    setInput(`<div class="example">Tom & Jerry's "HTML"</div>`);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Encode or decode HTML entities
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert HTML-sensitive characters into entities or decode entities
          back into readable text.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Mode</span>

        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as Mode)}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        >
          <option value="encode">Encode HTML entities</option>
          <option value="decode">Decode HTML entities</option>
        </select>
      </label>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste text or HTML entities here..."
      />

      <ToolResultBox title="Result">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Input characters" value={result.inputCharacters.toLocaleString()} />
          <ResultCard label="Output characters" value={result.outputCharacters.toLocaleString()} />
          <ResultCard label="Entities" value={result.entities.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy result
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        HTML entity encoding is useful when displaying code, escaping user input
        or preventing text from being interpreted as markup.
      </ToolInfoBox>
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