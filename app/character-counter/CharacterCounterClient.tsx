"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function CharacterCounterClient() {
  const [text, setText] = useState(
    "Paste your text here to count characters, spaces, letters, numbers, symbols and line breaks."
  );
  const [limit, setLimit] = useState(280);

  const result = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const spaces = (text.match(/\s/g) || []).length;
    const letters = (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const symbols = characters - letters - numbers - spaces;
    const words = text.trim() ? (text.match(/\b[\w'-]+\b/g) || []).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const remaining = limit - characters;
    const usagePercent = limit > 0 ? (characters / limit) * 100 : 0;

    return {
      characters,
      charactersNoSpaces,
      spaces,
      letters,
      numbers,
      symbols,
      words,
      lines,
      remaining,
      usagePercent,
    };
  }, [text, limit]);

  function clearText() {
    setText("");
  }

  function loadExample() {
    setText(
      "Paste your text here to count characters, spaces, letters, numbers, symbols and line breaks."
    );
    setLimit(280);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Count characters
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Count characters with and without spaces, letters, numbers, symbols,
          words, lines and remaining characters against a custom limit.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Character limit optional
          </span>

          <input
            type="number"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
          placeholder="Paste or type your text here..."
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Load example
          </button>

          <button
            type="button"
            onClick={clearText}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Clear text
          </button>
        </div>
      </div>

      <ToolResultBox title="Character analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Characters" value={result.characters.toLocaleString()} highlight />
          <ResultCard label="Characters without spaces" value={result.charactersNoSpaces.toLocaleString()} />
          <ResultCard label="Remaining characters" value={result.remaining.toLocaleString()} />
          <ResultCard label="Limit used" value={`${result.usagePercent.toFixed(1)}%`} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
          <ResultCard label="Spaces" value={result.spaces.toLocaleString()} />
          <ResultCard label="Letters" value={result.letters.toLocaleString()} />
          <ResultCard label="Numbers" value={result.numbers.toLocaleString()} />
          <ResultCard label="Symbols" value={result.symbols.toLocaleString()} />
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        Character limits are useful for social posts, meta descriptions, ads,
        bios, titles and form fields.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}