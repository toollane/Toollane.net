"use client";

import { useMemo, useState } from "react";

export default function ParagraphCounterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const paragraphs = text
      .split(/\n\s*\n/)
      .filter((paragraph) =>
        paragraph.trim()
      ).length;

    const characters =
      text.length;

    return {
      paragraphs,
      characters,
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Count Paragraphs
        </h2>

        <p className="text-black/60 leading-7">
          Count paragraphs and characters instantly for essays, articles, blog posts and writing projects.
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
            Paragraphs
          </div>

          <div className="text-3xl font-bold">
            {result.paragraphs}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Characters
          </div>

          <div className="text-3xl font-bold">
            {result.characters}
          </div>
        </div>
      </div>
    </div>
  );
}