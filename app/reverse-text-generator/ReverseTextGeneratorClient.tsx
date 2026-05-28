"use client";

import { useMemo, useState } from "react";

export default function ReverseTextGeneratorClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    return text.split("").reverse().join("");
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Reverse Text</h2>

        <p className="text-black/60 leading-7">
          Reverse letters and characters instantly for fun, formatting, testing and text experiments.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to reverse..."
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Reversed Text</div>

        <div className="break-words text-lg font-semibold">
          {result || "—"}
        </div>
      </div>
    </div>
  );
}