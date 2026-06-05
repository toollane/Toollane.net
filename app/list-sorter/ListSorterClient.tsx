"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type SortMode = "az" | "za" | "length-asc" | "length-desc" | "numeric-asc" | "numeric-desc" | "random";
type DuplicateMode = "keep" | "remove";

function shuffleArray(items: string[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export default function ListSorterClient() {
  const [text, setText] = useState("Banana\nApple\nOrange\nApple\nGrape\n42\n7\n19");
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>("keep");
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  const result = useMemo(() => {
    let lines = text.split("\n");

    if (trimLines) {
      lines = lines.map((line) => line.trim());
    }

    if (removeEmptyLines) {
      lines = lines.filter(Boolean);
    }

    const originalCount = lines.length;

    if (duplicateMode === "remove") {
      lines = Array.from(new Set(lines));
    }

    if (sortMode === "az") {
      lines = [...lines].sort((a, b) => a.localeCompare(b));
    }

    if (sortMode === "za") {
      lines = [...lines].sort((a, b) => b.localeCompare(a));
    }

    if (sortMode === "length-asc") {
      lines = [...lines].sort((a, b) => a.length - b.length || a.localeCompare(b));
    }

    if (sortMode === "length-desc") {
      lines = [...lines].sort((a, b) => b.length - a.length || a.localeCompare(b));
    }

    if (sortMode === "numeric-asc") {
      lines = [...lines].sort((a, b) => Number(a) - Number(b));
    }

    if (sortMode === "numeric-desc") {
      lines = [...lines].sort((a, b) => Number(b) - Number(a));
    }

    if (sortMode === "random") {
      lines = shuffleArray(lines);
    }

    return {
      output: lines.join("\n"),
      originalCount,
      finalCount: lines.length,
      removedCount: originalCount - lines.length,
      emptyCount: text.split("\n").filter((line) => !line.trim()).length,
    };
  }, [text, sortMode, duplicateMode, trimLines, removeEmptyLines]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setText("Banana\nApple\nOrange\nApple\nGrape\n42\n7\n19");
    setSortMode("az");
    setDuplicateMode("keep");
    setTrimLines(true);
    setRemoveEmptyLines(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Sort lists online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Sort lines alphabetically, reverse sort, sort by length, sort numbers,
          randomize lists and remove duplicates.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Sort mode</span>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
              <option value="length-asc">Shortest first</option>
              <option value="length-desc">Longest first</option>
              <option value="numeric-asc">Number low to high</option>
              <option value="numeric-desc">Number high to low</option>
              <option value="random">Randomize</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Duplicates</span>

            <select
              value={duplicateMode}
              onChange={(event) => setDuplicateMode(event.target.value as DuplicateMode)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="keep">Keep duplicates</option>
              <option value="remove">Remove duplicates</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Trim lines" checked={trimLines} onChange={setTrimLines} />
          <Toggle label="Remove empty lines" checked={removeEmptyLines} onChange={setRemoveEmptyLines} />
        </div>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Enter one item per line..."
      />

      <ToolResultBox title="Sorted list">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Original lines" value={result.originalCount.toLocaleString()} />
          <ResultCard label="Final lines" value={result.finalCount.toLocaleString()} />
          <ResultCard label="Removed duplicates" value={result.removedCount.toLocaleString()} />
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
        List sorting is useful for names, keywords, spreadsheet exports, IDs,
        product lists, URLs and cleanup tasks.
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