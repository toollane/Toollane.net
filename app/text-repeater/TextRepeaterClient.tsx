"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";
import ToolInfoBox from "@/components/ToolInfoBox";

type SeparatorMode =
  | "newline"
  | "space"
  | "comma"
  | "none"
  | "custom";

export default function TextRepeaterClient() {
  const [text, setText] = useState("Repeat this text");
  const [repeatCount, setRepeatCount] = useState(10);
  const [separatorMode, setSeparatorMode] =
    useState<SeparatorMode>("newline");
  const [customSeparator, setCustomSeparator] = useState(" | ");
  const [numberLines, setNumberLines] = useState(false);

  const result = useMemo(() => {
    const separator =
      separatorMode === "newline"
        ? "\n"
        : separatorMode === "space"
          ? " "
          : separatorMode === "comma"
            ? ", "
            : separatorMode === "none"
              ? ""
              : customSeparator;

    const repeated = Array.from({ length: repeatCount }, (_, index) => {
      if (numberLines) {
        return `${index + 1}. ${text}`;
      }

      return text;
    }).join(separator);

    return {
      repeated,
      characters: repeated.length,
      words: repeated.trim()
        ? (repeated.match(/\b[\w'-]+\b/g) || []).length
        : 0,
      lines: repeated ? repeated.split("\n").length : 0,
    };
  }, [
    text,
    repeatCount,
    separatorMode,
    customSeparator,
    numberLines,
  ]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.repeated);
  }

  function resetExample() {
    setText("Repeat this text");
    setRepeatCount(10);
    setSeparatorMode("newline");
    setCustomSeparator(" | ");
    setNumberLines(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Repeat text online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Repeat words, phrases and text blocks multiple times with custom
          separators and numbering options.
        </p>
      </div>

      <div className="grid gap-5">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[160px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
          placeholder="Enter text to repeat..."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">
              Repeat count
            </span>

            <input
              type="number"
              min="1"
              max="10000"
              value={repeatCount}
              onChange={(event) =>
                setRepeatCount(Number(event.target.value))
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Separator
            </span>

            <select
              value={separatorMode}
              onChange={(event) =>
                setSeparatorMode(event.target.value as SeparatorMode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="newline">New line</option>
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="none">No separator</option>
              <option value="custom">Custom separator</option>
            </select>
          </label>
        </div>

        {separatorMode === "custom" && (
          <label className="block">
            <span className="text-sm font-bold text-black">
              Custom separator
            </span>

            <input
              value={customSeparator}
              onChange={(event) => setCustomSeparator(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        )}

        <Toggle
          label="Number repeated lines"
          checked={numberLines}
          onChange={setNumberLines}
        />
      </div>

      <ToolResultBox title="Repeated text">
        <textarea
          readOnly
          value={result.repeated}
          className="min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy result
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Text repeating is useful for testing, templates, prompts, placeholders,
        formatting and content generation workflows.
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
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}