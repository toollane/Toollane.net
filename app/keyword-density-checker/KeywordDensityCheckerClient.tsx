"use client";

import { useMemo, useState } from "react";

export default function KeywordDensityCheckerClient() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");

  const result = useMemo(() => {
    const normalizedText =
      text.toLowerCase();

    const normalizedKeyword =
      keyword.toLowerCase().trim();

    const words = normalizedText
      .split(/\s+/)
      .filter(Boolean);

    const totalWords = words.length;

    if (
      !normalizedKeyword ||
      !totalWords
    ) {
      return {
        occurrences: 0,
        density: "0",
      };
    }

    const occurrences =
      normalizedText.split(normalizedKeyword)
        .length - 1;

    const density =
      (occurrences / totalWords) * 100;

    return {
      occurrences,
      density:
        density.toFixed(2),
    };
  }, [text, keyword]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Check Keyword Density
        </h2>

        <p className="text-black/60 leading-7">
          Analyze how frequently a keyword appears within your text for SEO optimization.
        </p>
      </div>

      <input
        type="text"
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
        placeholder="Enter keyword..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Paste your content here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Keyword Occurrences
          </div>

          <div className="text-3xl font-bold">
            {result.occurrences}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Keyword Density
          </div>

          <div className="text-3xl font-bold">
            {result.density}%
          </div>
        </div>
      </div>
    </div>
  );
}