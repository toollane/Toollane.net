"use client";

import { useMemo, useState } from "react";

export default function FindAndReplaceClient() {
  const [text, setText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const result = useMemo(() => {
    if (!findText) {
      return text;
    }

    return text.split(findText).join(replaceText);
  }, [text, findText, replaceText]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Find and Replace Text
        </h2>

        <p className="text-black/60 leading-7">
          Replace words, names, phrases or characters across large text instantly.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          placeholder="Find..."
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          placeholder="Replace with..."
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Result
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}