"use client";

import { useMemo, useState } from "react";

import { marked } from "marked";

export default function MarkdownToHtmlClient() {
  const [markdown, setMarkdown] =
    useState("# Hello Toollane\n\nWrite **Markdown** here.");

  const html = useMemo(() => {
    return marked.parse(markdown) as string;
  }, [markdown]);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
  };

  const downloadHtml = () => {
    const blob = new Blob([html], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.html";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Markdown to HTML
        </h2>

        <p className="text-black/60 leading-7">
          Convert Markdown text into
          clean HTML instantly in your
          browser.
        </p>
      </div>

      <textarea
        value={markdown}
        onChange={(event) =>
          setMarkdown(event.target.value)
        }
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={copyHtml}
          disabled={!html}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
        >
          Copy HTML
        </button>

        <button
          onClick={downloadHtml}
          disabled={!html}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
        >
          Download HTML
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6 overflow-x-auto">
        <div className="font-semibold mb-3">
          HTML Output
        </div>

        <pre className="text-sm whitespace-pre-wrap break-words text-black/70">
          {html}
        </pre>
      </div>
    </div>
  );
}