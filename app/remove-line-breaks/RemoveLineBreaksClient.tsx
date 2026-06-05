"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type JoinMode = "space" | "comma" | "semicolon" | "empty" | "custom";

export default function RemoveLineBreaksClient() {
  const [text, setText] = useState("This text\nhas multiple\nline breaks.\n\nIt can be joined into one line.");
  const [joinMode, setJoinMode] = useState<JoinMode>("space");
  const [customSeparator, setCustomSeparator] = useState(" | ");
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);

  const result = useMemo(() => {
    const originalLines = text.split(/\r?\n/);

    let lines = originalLines.map((line) => (trimLines ? line.trim() : line));

    if (removeEmptyLines) {
      lines = lines.filter(Boolean);
    }

    const separator =
      joinMode === "space"
        ? " "
        : joinMode === "comma"
          ? ", "
          : joinMode === "semicolon"
            ? "; "
            : joinMode === "empty"
              ? ""
              : customSeparator;

    let output = lines.join(separator);

    if (collapseSpaces) {
      output = output.replace(/[ \t]+/g, " ");
    }

    return {
      output,
      originalLines: originalLines.length,
      finalCharacters: output.length,
      removedBreaks: Math.max(0, originalLines.length - 1),
      words: output.trim() ? (output.match(/\b[\w'-]+\b/g) || []).length : 0,
    };
  }, [
    text,
    joinMode,
    customSeparator,
    trimLines,
    removeEmptyLines,
    collapseSpaces,
  ]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setText("This text\nhas multiple\nline breaks.\n\nIt can be joined into one line.");
    setJoinMode("space");
    setCustomSeparator(" | ");
    setTrimLines(true);
    setRemoveEmptyLines(true);
    setCollapseSpaces(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Remove line breaks
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Remove line breaks and join text with spaces, commas, semicolons,
          nothing or a custom separator.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Join lines with</span>

          <select
            value={joinMode}
            onChange={(event) => setJoinMode(event.target.value as JoinMode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="semicolon">Semicolon</option>
            <option value="empty">Nothing</option>
            <option value="custom">Custom separator</option>
          </select>
        </label>

        {joinMode === "custom" && (
          <label className="block">
            <span className="text-sm font-bold text-black">Custom separator</span>

            <input
              value={customSeparator}
              onChange={(event) => setCustomSeparator(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Trim lines" checked={trimLines} onChange={setTrimLines} />
          <Toggle label="Remove empty lines" checked={removeEmptyLines} onChange={setRemoveEmptyLines} />
          <Toggle label="Collapse spaces" checked={collapseSpaces} onChange={setCollapseSpaces} />
        </div>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste text with line breaks..."
      />

      <ToolResultBox title="Text without line breaks">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Original lines" value={result.originalLines.toLocaleString()} />
          <ResultCard label="Removed breaks" value={result.removedBreaks.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Characters" value={result.finalCharacters.toLocaleString()} />
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
        This tool is useful for cleaning copied PDFs, emails, spreadsheet text,
        AI outputs, addresses and pasted content with unwanted line breaks.
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