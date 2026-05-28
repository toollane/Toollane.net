"use client";

import { useMemo, useState } from "react";

export default function ReadingTimeCalculatorClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    const averageWordsPerMinute = 200;

    const readingMinutes =
      words / averageWordsPerMinute;

    return {
      words,
      readingMinutes:
        readingMinutes.toFixed(1),
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Reading Time
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how long text takes to read based on average reading speed.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Word Count
          </div>

          <div className="text-3xl font-bold">
            {result.words}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Reading Time
          </div>

          <div className="text-3xl font-bold">
            {result.readingMinutes} min
          </div>
        </div>
      </div>
    </div>
  );
}