"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","commodo","consequat"
];

type GenerateMode = "paragraphs" | "sentences" | "words";

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(wordCount: number) {
  const words = Array.from({ length: wordCount }, randomWord);

  const sentence =
    words
      .join(" ")
      .replace(/^./, (char) => char.toUpperCase()) + ".";

  return sentence;
}

function generateParagraph(sentences: number) {
  return Array.from({ length: sentences }, () =>
    generateSentence(8 + Math.floor(Math.random() * 10))
  ).join(" ");
}

export default function LoremIpsumGeneratorClient() {
  const [mode, setMode] =
    useState<GenerateMode>("paragraphs");

  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const result = useMemo(() => {
    let output = "";

    if (mode === "words") {
      output = Array.from({ length: count }, randomWord).join(" ");
    }

    if (mode === "sentences") {
      output = Array.from({ length: count }, () =>
        generateSentence(8 + Math.floor(Math.random() * 10))
      ).join(" ");
    }

    if (mode === "paragraphs") {
      output = Array.from({ length: count }, () =>
        generateParagraph(4 + Math.floor(Math.random() * 3))
      ).join("\n\n");
    }

    if (startWithLorem) {
      output = `Lorem ipsum dolor sit amet. ${output}`;
    }

    const words = output.match(/\b[\w'-]+\b/g) || [];

    return {
      output,
      characters: output.length,
      words: words.length,
      paragraphs: output
        ? output.split(/\n\s*\n/).filter(Boolean).length
        : 0,
    };
  }, [mode, count, startWithLorem]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.output);
  }

  function resetExample() {
    setMode("paragraphs");
    setCount(3);
    setStartWithLorem(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate lorem ipsum text
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate placeholder paragraphs, sentences and words for websites,
          layouts, mockups and content design.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Generate
          </span>

          <select
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as GenerateMode)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Count
          </span>

          <input
            type="number"
            min="1"
            max="500"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>
      </div>

      <Toggle
        label="Start with Lorem ipsum"
        checked={startWithLorem}
        onChange={setStartWithLorem}
      />

      <ToolResultBox title="Generated placeholder text">
        <textarea
          readOnly
          value={result.output}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Paragraphs" value={result.paragraphs.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy text
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
        Lorem ipsum placeholder text is commonly used in UI design, print
        layouts, templates, wireframes and content previews.
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