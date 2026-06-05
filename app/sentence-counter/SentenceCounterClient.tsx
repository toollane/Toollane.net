"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function SentenceCounterClient() {
  const [text, setText] = useState(
    "This is the first sentence. This is another one! Can this tool count questions too? Yes, it can."
  );

  const result = useMemo(() => {
    const trimmed = text.trim();
    const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const words = trimmed.match(/\b[\w'-]+\b/g) || [];
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((item) => item.trim()).length
      : 0;

    const questions = (text.match(/\?/g) || []).length;
    const exclamations = (text.match(/!/g) || []).length;
    const averageWordsPerSentence =
      sentences.length > 0 ? words.length / sentences.length : 0;
    const averageCharactersPerSentence =
      sentences.length > 0 ? trimmed.length / sentences.length : 0;

    return {
      sentences: trimmed ? sentences.length : 0,
      words: words.length,
      paragraphs,
      questions,
      exclamations,
      averageWordsPerSentence,
      averageCharactersPerSentence,
    };
  }, [text]);

  function clearText() {
    setText("");
  }

  function loadExample() {
    setText(
      "This is the first sentence. This is another one! Can this tool count questions too? Yes, it can."
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Count sentences
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Count sentences, questions, exclamations, words, paragraphs and
          average sentence length.
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

      <ToolResultBox title="Sentence analysis">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Sentences" value={result.sentences.toLocaleString()} highlight />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Paragraphs" value={result.paragraphs.toLocaleString()} />
          <ResultCard label="Questions" value={result.questions.toLocaleString()} />
          <ResultCard label="Exclamations" value={result.exclamations.toLocaleString()} />
          <ResultCard label="Avg. words per sentence" value={result.averageWordsPerSentence.toFixed(2)} />
          <ResultCard label="Avg. chars per sentence" value={result.averageCharactersPerSentence.toFixed(2)} />
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        Shorter sentences are often easier to read. Long sentence averages can
        make copy feel dense, especially on mobile screens.
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