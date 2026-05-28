"use client";

import { useMemo, useState } from "react";

export default function CssMinifierClient() {
  const [css, setCss] =
    useState("");

  const minified = useMemo(() => {
    if (!css.trim()) {
      return "";
    }

    return css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();
  }, [css]);

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
          CSS Minifier
        </h2>

        <p className="text-black/60 leading-7">
          Minify CSS code instantly
          to reduce stylesheet size
          and improve website
          performance.
        </p>
      </div>

      <textarea
        value={css}
        onChange={(event) =>
          setCss(event.target.value)
        }
        placeholder={`body {
  background: white;
  color: black;
}`}
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Minified CSS
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
          Copy CSS
        </button>
      )}
    </div>
  );
}