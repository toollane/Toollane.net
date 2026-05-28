"use client";

import { useMemo, useState } from "react";

function encodeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function decodeHtml(value: string) {
  if (typeof window === "undefined") {
    return value;
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;

  return textarea.value;
}

export default function HtmlEntityEncoderDecoderClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) {
      return "";
    }

    if (mode === "encode") {
      return encodeHtml(input);
    }

    return decodeHtml(input);
  }, [input, mode]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Encode or Decode HTML Entities
        </h2>

        <p className="text-black/60 leading-7">
          Convert HTML characters into entities or decode HTML entities back to readable text.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`px-4 py-3 rounded-2xl border transition ${
            mode === "encode"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Encode
        </button>

        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`px-4 py-3 rounded-2xl border transition ${
            mode === "decode"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Decode
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "encode"
            ? "Enter HTML or text..."
            : "Enter HTML entities..."
        }
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Output
        </div>

        <pre className="whitespace-pre-wrap break-words font-mono text-sm">
          {output || "—"}
        </pre>
      </div>
    </div>
  );
}