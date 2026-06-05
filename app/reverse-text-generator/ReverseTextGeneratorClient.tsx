"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";
import ToolInfoBox from "@/components/ToolInfoBox";

type ReverseMode =
  | "characters"
  | "words"
  | "lines"
  | "flip";

function flipText(text: string) {
  const map: Record<string, string> = {
    a: "ɐ",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ᴉ",
    j: "ɾ",
    k: "ʞ",
    l: "l",
    m: "ɯ",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "ɹ",
    s: "s",
    t: "ʇ",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    x: "x",
    y: "ʎ",
    z: "z",
  };

  return text
    .split("")
    .reverse()
    .map((char) => map[char.toLowerCase()] || char)
    .join("");
}

export default function ReverseTextGeneratorClient() {
  const [text, setText] = useState(
    "Reverse this text in different ways."
  );

  const [mode, setMode] =
    useState<ReverseMode>("characters");

  const result = useMemo(() => {
    let output = "";

    if (mode === "characters") {
      output = text.split("").reverse().join("");
    }

    if (mode === "words") {
      output = text.split(/\s+/).reverse().join(" ");
    }

    if (mode === "lines") {
      output = text.split("\n").reverse().join("\n");
    }

    if (mode === "flip") {
      output = flipText(text);
    }

    return {
      output,
      characters: output.length,
      words: output.trim()
        ? (output.match(/\b[\w'-]+\b/g) || []).length
        : 0,
    };
  }, [text, mode]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setText("Reverse this text in different ways.");
    setMode("characters");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Reverse text online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Reverse characters, words, lines or create flipped upside-down text.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          Reverse mode
        </span>

        <select
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as ReverseMode)
          }
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        >
          <option value="characters">Reverse characters</option>
          <option value="words">Reverse words</option>
          <option value="lines">Reverse lines</option>
          <option value="flip">Flip upside down</option>
        </select>
      </label>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Enter text..."
      />

      <ToolResultBox title="Reversed text">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
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
        Reverse text tools are often used for formatting, social posts, puzzles,
        testing and playful text transformations.
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
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}