"use client";

import { useMemo, useState } from "react";

export default function RemoveDuplicateLinesClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!text.trim()) return "";

    const seen = new Set<string>();

    return text
      .split(/\r?\n/)
      .filter((line) => {
        const normalized = line.trim();

        if (!normalized || seen.has(normalized)) {
          return false;
        }

        seen.add(normalized);
        return true;
      })
      .join("\n");
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Remove Duplicate Lines</h2>

        <p className="text-black/60 leading-7">
          Remove duplicate lines from lists, names, keywords, CSV snippets and text data instantly.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={`apple\nbanana\napple\norange`}
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Unique Lines</div>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}