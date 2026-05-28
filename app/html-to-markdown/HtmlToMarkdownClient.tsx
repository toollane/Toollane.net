"use client";

import { useMemo, useState } from "react";

import TurndownService from "turndown";

export default function HtmlToMarkdownClient() {
  const [html, setHtml] =
    useState("<h1>Hello Toollane</h1><p>Paste <strong>HTML</strong> here.</p>");

  const markdown = useMemo(() => {
    const turndownService =
      new TurndownService();

    return turndownService.turndown(html);
  }, [html]);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.md";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          HTML to Markdown
        </h2>

        <p className="text-black/60 leading-7">
          Convert HTML code into clean
          Markdown instantly in your
          browser.
        </p>
      </div>

      <textarea
        value={html}
        onChange={(event) =>
          setHtml(event.target.value)
        }
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={copyMarkdown}
          disabled={!markdown}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
        >
          Copy Markdown
        </button>

        <button
          onClick={downloadMarkdown}
          disabled={!markdown}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
        >
          Download Markdown
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6 overflow-x-auto">
        <div className="font-semibold mb-3">
          Markdown Output
        </div>

        <pre className="text-sm whitespace-pre-wrap break-words text-black/70">
          {markdown}
        </pre>
      </div>
    </div>
  );
}