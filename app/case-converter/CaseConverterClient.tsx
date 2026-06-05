"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CaseMode =
  | "lower"
  | "upper"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating";

function toWords(text: string) {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function convertCase(text: string, mode: CaseMode) {
  const words = toWords(text);

  if (mode === "lower") return text.toLowerCase();
  if (mode === "upper") return text.toUpperCase();

  if (mode === "title") {
    return words.map(capitalize).join(" ");
  }

  if (mode === "sentence") {
    const lower = text.toLowerCase();

    return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) =>
      match.toUpperCase()
    );
  }

  if (mode === "camel") {
    return words
      .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
      .join("");
  }

  if (mode === "pascal") {
    return words.map(capitalize).join("");
  }

  if (mode === "snake") {
    return words.map((word) => word.toLowerCase()).join("_");
  }

  if (mode === "kebab") {
    return words.map((word) => word.toLowerCase()).join("-");
  }

  if (mode === "constant") {
    return words.map((word) => word.toUpperCase()).join("_");
  }

  return text
    .split("")
    .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
    .join("");
}

export default function CaseConverterClient() {
  const [text, setText] = useState("Convert this example text into different cases.");
  const [mode, setMode] = useState<CaseMode>("title");

  const result = useMemo(() => {
    const converted = convertCase(text, mode);
    const words = text.trim().match(/\b[\w'-]+\b/g) || [];

    return {
      converted,
      characters: text.length,
      words: words.length,
      lines: text ? text.split("\n").length : 0,
    };
  }, [text, mode]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.converted);
  }

  function clearText() {
    setText("");
  }

  function resetExample() {
    setText("Convert this example text into different cases.");
    setMode("title");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert text case
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert text to uppercase, lowercase, title case, sentence case, camel
          case, PascalCase, snake_case, kebab-case and CONSTANT_CASE.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Case format</span>

        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as CaseMode)}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        >
          <option value="lower">lowercase</option>
          <option value="upper">UPPERCASE</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
          <option value="camel">camelCase</option>
          <option value="pascal">PascalCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
          <option value="constant">CONSTANT_CASE</option>
          <option value="alternating">aLtErNaTiNg cAsE</option>
        </select>
      </label>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste or type text here..."
      />

      <ToolResultBox title="Converted text">
        <textarea
          readOnly
          value={result.converted}
          className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy result
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>

        <button type="button" onClick={clearText} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Clear
        </button>
      </div>

      <ToolInfoBox>
        Case conversion is useful for code identifiers, file names, headings,
        slugs, spreadsheet cleanup and content formatting.
      </ToolInfoBox>
    </div>
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