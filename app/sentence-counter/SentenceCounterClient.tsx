"use client";

import { useMemo, useState } from "react";

export default function SentenceCounterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const sentences = text
      .split(/[.!?]+/)
      .filter((sentence) =>
        sentence.trim()
      ).length;

    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return {
      sentences,
      words,
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Count Sentences
        </h2>

        <p className="text-black/60 leading-7">
          Count sentences and words instantly for writing, SEO, essays and content optimization.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Paste your text here..."
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Sentences
          </div>

          <div className="text-3xl font-bold">
            {result.sentences}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Words
          </div>

          <div className="text-3xl font-bold">
            {result.words}
          </div>
        </div>
      </div>
    </div>
  );
}