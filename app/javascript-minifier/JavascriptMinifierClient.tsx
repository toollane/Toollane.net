"use client";

import { useMemo, useState } from "react";

export default function JavascriptMinifierClient() {
  const [javascript, setJavascript] =
    useState("");

  const minified = useMemo(() => {
    if (!javascript.trim()) {
      return "";
    }

    return javascript
      .replace(/\/\/.*$/gm, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}();,:=+\-*/<>])\s*/g, "$1")
      .trim();
  }, [javascript]);

  const copyOutput = async () => {
    if (!minified) {
      return;
    }

    await navigator.clipboard.writeText(
      minified
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          JavaScript Minifier
        </h2>

        <p className="text-black/60 leading-7">
          Minify JavaScript code
          instantly to reduce file
          size and improve loading
          performance.
        </p>
      </div>

      <textarea
        value={javascript}
        onChange={(event) =>
          setJavascript(
            event.target.value
          )
        }
        placeholder={`function hello() {
  console.log("Hello");
}`}
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Minified JavaScript
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {minified || "—"}
        </pre>
      </div>

      {minified && (
        <button
          onClick={copyOutput}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
        >
          Copy JavaScript
        </button>
      )}
    </div>
  );
}