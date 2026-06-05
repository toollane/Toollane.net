"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function countSyllables(word: string) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");

  if (!cleaned) return 0;

  const matches = cleaned.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;

  if (cleaned.endsWith("e")) {
    count -= 1;
  }

  return Math.max(1, count);
}

export default function WordCounterClient() {
  const [text, setText] = useState(
    "Paste your text here to count words, characters, sentences, paragraphs and estimate reading time."
  );

  const result = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed.match(/\b[\w'-]+\b/g) || [];
    const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((item) => item.trim()).length
      : 0;

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const spaces = (text.match(/\s/g) || []).length;
    const lines = text ? text.split("\n").length : 0;
    const uniqueWords = new Set(words.map((word) => word.toLowerCase())).size;
    const averageWordLength =
      words.length > 0
        ? words.join("").length / words.length
        : 0;

    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const readingMinutes = words.length / 225;
    const speakingMinutes = words.length / 150;

    const fleschReadingEase =
      words.length > 0 && sentences.length > 0
        ? 206.835 -
          1.015 * (words.length / sentences.length) -
          84.6 * (syllables / words.length)
        : 0;

    return {
      words: words.length,
      uniqueWords,
      sentences: trimmed ? sentences.length : 0,
      paragraphs,
      characters,
      charactersNoSpaces,
      spaces,
      lines,
      averageWordLength,
      readingMinutes,
      speakingMinutes,
      fleschReadingEase,
    };
  }, [text]);

  function clearText() {
    setText("");
  }

  function loadExample() {
    setText(
      "Paste your text here to count words, characters, sentences, paragraphs and estimate reading time."
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Count words and text statistics
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Analyze word count, character count, sentence count, paragraph count,
          reading time, speaking time and readability.
        </p>
      </div>

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

      <ToolResultBox title="Text analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Words" value={result.words.toLocaleString()} highlight />
          <ResultCard label="Unique words" value={result.uniqueWords.toLocaleString()} />
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Characters without spaces" value={result.charactersNoSpaces.toLocaleString()} />
          <ResultCard label="Sentences" value={result.sentences.toLocaleString()} />
          <ResultCard label="Paragraphs" value={result.paragraphs.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
          <ResultCard label="Spaces" value={result.spaces.toLocaleString()} />
          <ResultCard label="Average word length" value={result.averageWordLength.toFixed(2)} />
          <ResultCard label="Reading time" value={`${Math.max(1, Math.ceil(result.readingMinutes))} min`} />
          <ResultCard label="Speaking time" value={`${Math.max(1, Math.ceil(result.speakingMinutes))} min`} />
          <ResultCard label="Readability score" value={result.fleschReadingEase.toFixed(1)} />
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        Reading time is estimated at 225 words per minute and speaking time at
        150 words per minute. Readability is an approximation.
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