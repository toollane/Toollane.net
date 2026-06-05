"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function RemoveDuplicateLinesClient() {
  const [text, setText] = useState("Apple\nBanana\nApple\nOrange\nbanana\nGrape\nOrange");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [keepOrder, setKeepOrder] = useState(true);

  const result = useMemo(() => {
    const originalLines = text.split("\n");
    const seen = new Set<string>();
    const duplicates: string[] = [];

    let lines = originalLines.map((line) => (trimLines ? line.trim() : line));

    if (removeEmptyLines) {
      lines = lines.filter(Boolean);
    }

    const uniqueLines = lines.filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase();

      if (seen.has(key)) {
        duplicates.push(line);
        return false;
      }

      seen.add(key);
      return true;
    });

    const finalLines = keepOrder
      ? uniqueLines
      : [...uniqueLines].sort((a, b) => a.localeCompare(b));

    return {
      output: finalLines.join("\n"),
      originalCount: originalLines.length,
      processedCount: lines.length,
      uniqueCount: finalLines.length,
      duplicateCount: duplicates.length,
      emptyCount: originalLines.filter((line) => !line.trim()).length,
    };
  }, [text, caseSensitive, trimLines, removeEmptyLines, keepOrder]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setText("Apple\nBanana\nApple\nOrange\nbanana\nGrape\nOrange");
    setCaseSensitive(false);
    setTrimLines(true);
    setRemoveEmptyLines(true);
    setKeepOrder(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Remove duplicate lines
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Remove duplicate lines from lists while optionally trimming lines,
          ignoring case and removing empty rows.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Case sensitive" checked={caseSensitive} onChange={setCaseSensitive} />
        <Toggle label="Trim lines" checked={trimLines} onChange={setTrimLines} />
        <Toggle label="Remove empty lines" checked={removeEmptyLines} onChange={setRemoveEmptyLines} />
        <Toggle label="Keep original order" checked={keepOrder} onChange={setKeepOrder} />
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste one item per line..."
      />

      <ToolResultBox title="Cleaned lines">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Original lines" value={result.originalCount.toLocaleString()} />
          <ResultCard label="Processed lines" value={result.processedCount.toLocaleString()} />
          <ResultCard label="Unique lines" value={result.uniqueCount.toLocaleString()} />
          <ResultCard label="Duplicates removed" value={result.duplicateCount.toLocaleString()} />
          <ResultCard label="Empty lines" value={result.emptyCount.toLocaleString()} />
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
        Duplicate line removal is useful for keyword lists, emails, IDs, URLs,
        product SKUs, datasets and spreadsheet cleanup.
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

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 text-black">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}