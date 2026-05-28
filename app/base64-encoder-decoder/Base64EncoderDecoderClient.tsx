"use client";

import { useMemo, useState } from "react";

export default function Base64EncoderDecoderClient() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) {
      return "";
    }

    try {
      if (mode === "encode") {
        return btoa(unescape(encodeURIComponent(input)));
      }

      return decodeURIComponent(escape(atob(input)));
    } catch {
      return "Invalid Base64 input.";
    }
  }, [input, mode]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Encode or Decode Base64
        </h2>

        <p className="text-black/60 leading-7">
          Encode text to Base64 or decode Base64 back to readable text instantly.
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
        placeholder={mode === "encode" ? "Enter text..." : "Enter Base64..."}
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Output
        </div>

        <div className="break-words font-medium whitespace-pre-wrap">
          {output || "—"}
        </div>
      </div>
    </div>
  );
}