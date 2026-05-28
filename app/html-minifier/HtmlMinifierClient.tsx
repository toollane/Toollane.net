"use client";

import { useMemo, useState } from "react";

export default function HtmlMinifierClient() {
  const [html, setHtml] =
    useState("");

  const minified = useMemo(() => {
    if (!html.trim()) {
      return "";
    }

    return html
      .replace(/>\s+</g, "><")
      .replace(/\n/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }, [html]);

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
          HTML Minifier
        </h2>

        <p className="text-black/60 leading-7">
          Minify HTML code instantly
          to reduce file size and
          improve website performance.
        </p>
      </div>

      <textarea
        value={html}
        onChange={(event) =>
          setHtml(event.target.value)
        }
        placeholder={`<div>
  <h1>Hello World</h1>
</div>`}
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Minified HTML
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
          Copy HTML
        </button>
      )}
    </div>
  );
}