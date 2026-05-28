"use client";

import { useMemo, useState } from "react";

export default function WordCounterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const trimmed = text.trim();

    const words = trimmed
      ? trimmed.split(/\s+/).filter(Boolean).length
      : 0;

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((item) => item.trim()).length
      : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Count Words and Characters
        </h2>

        <p className="text-black/60 leading-7">
          Paste or type text to count words, characters and sentences instantly.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Words</div>
          <div className="text-3xl font-bold">{result.words}</div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Characters</div>
          <div className="text-3xl font-bold">{result.characters}</div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">No Spaces</div>
          <div className="text-3xl font-bold">
            {result.charactersNoSpaces}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Sentences</div>
          <div className="text-3xl font-bold">{result.sentences}</div>
        </div>
      </div>
    </div>
  );
}