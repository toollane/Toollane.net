"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function ReadingTimeCalculatorClient() {
  const [text, setText] = useState(
    "Paste your article, blog post, script or newsletter here to estimate reading time and speaking time."
  );
  const [readingSpeed, setReadingSpeed] = useState(225);
  const [speakingSpeed, setSpeakingSpeed] = useState(150);

  const result = useMemo(() => {
    const words = text.trim().match(/\b[\w'-]+\b/g) || [];
    const sentences = text.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const paragraphs = text.trim()
      ? text.trim().split(/\n\s*\n/).filter((item) => item.trim()).length
      : 0;

    const readingMinutes = readingSpeed > 0 ? words.length / readingSpeed : 0;
    const speakingMinutes = speakingSpeed > 0 ? words.length / speakingSpeed : 0;

    return {
      words: words.length,
      sentences: text.trim() ? sentences.length : 0,
      paragraphs,
      readingMinutes,
      speakingMinutes,
      readingSeconds: Math.round(readingMinutes * 60),
      speakingSeconds: Math.round(speakingMinutes * 60),
    };
  }, [text, readingSpeed, speakingSpeed]);

  function clearText() {
    setText("");
  }

  function loadExample() {
    setText(
      "Paste your article, blog post, script or newsletter here to estimate reading time and speaking time."
    );
    setReadingSpeed(225);
    setSpeakingSpeed(150);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate reading time
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate reading time and speaking time based on word count and custom
          speed settings.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Reading speed words per minute"
            value={readingSpeed}
            onChange={setReadingSpeed}
          />

          <NumberInput
            label="Speaking speed words per minute"
            value={speakingSpeed}
            onChange={setSpeakingSpeed}
          />
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
      </div>

      <ToolResultBox title="Reading time result">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Reading time" value={`${Math.max(1, Math.ceil(result.readingMinutes))} min`} highlight />
          <ResultCard label="Speaking time" value={`${Math.max(1, Math.ceil(result.speakingMinutes))} min`} />
          <ResultCard label="Reading seconds" value={result.readingSeconds.toLocaleString()} />
          <ResultCard label="Speaking seconds" value={result.speakingSeconds.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Sentences" value={result.sentences.toLocaleString()} />
          <ResultCard label="Paragraphs" value={result.paragraphs.toLocaleString()} />
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        Average silent reading speed is often around 200–250 words per minute.
        Speaking speed is usually slower, often around 130–170 words per minute.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        min="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
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