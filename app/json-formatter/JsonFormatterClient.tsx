"use client";

import { useMemo, useState } from "react";

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        output: "",
        error: "",
      };
    }

    try {
      const parsed = JSON.parse(input);

      return {
        output: JSON.stringify(parsed, null, 2),
        error: "",
      };
    } catch {
      return {
        output: "",
        error: "Invalid JSON. Please check your syntax.",
      };
    }
  }, [input]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Format JSON
        </h2>

        <p className="text-black/60 leading-7">
          Paste JSON to format, beautify and make it easier to read.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"name":"Toollane","type":"tool"}'
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      {result.error && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-black/70">
          {result.error}
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Formatted JSON
        </div>

        <pre className="whitespace-pre-wrap break-words font-mono text-sm">
          {result.output || "—"}
        </pre>
      </div>
    </div>
  );
}