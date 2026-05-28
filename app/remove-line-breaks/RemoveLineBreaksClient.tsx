"use client";

import { useMemo, useState } from "react";

export default function RemoveLineBreaksClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    return text.replace(/\s*\n+\s*/g, " ").trim();
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Remove Line Breaks</h2>

        <p className="text-black/60 leading-7">
          Remove line breaks from text and turn multiple lines into a clean paragraph.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text with line breaks..."
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Cleaned Text</div>

        <div className="break-words font-medium">
          {result || "—"}
        </div>
      </div>
    </div>
  );
}