"use client";

import { useMemo, useState } from "react";

export default function ListSorterClient() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"az" | "za">("az");

  const result = useMemo(() => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const sorted = [...lines].sort((a, b) =>
      mode === "az" ? a.localeCompare(b) : b.localeCompare(a)
    );

    return sorted.join("\n");
  }, [text, mode]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Sort Lists Online
        </h2>

        <p className="text-black/60 leading-7">
          Sort names, words, products or any text list alphabetically.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setMode("az")}
          className={`px-5 py-3 rounded-2xl border ${
            mode === "az"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          A to Z
        </button>

        <button
          onClick={() => setMode("za")}
          className={`px-5 py-3 rounded-2xl border ${
            mode === "za"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Z to A
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter one item per line..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Sorted List
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}