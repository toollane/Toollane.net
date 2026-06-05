"use client";

import { useMemo, useState } from "react";

import { marked } from "marked";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function MarkdownToHtmlClient() {
  const [markdown, setMarkdown] = useState(`# Example Markdown

Convert **Markdown** to HTML.

- Fast
- Clean
- Browser-based

[Example link](https://example.com)
`);

  const result = useMemo(() => {
    const html = marked.parse(markdown) as string;
    const words = markdown.match(/\b[\w'-]+\b/g) || [];

    return {
      html,
      markdownCharacters: markdown.length,
      htmlCharacters: html.length,
      words: words.length,
      lines: markdown.split("\n").length,
    };
  }, [markdown]);

  async function copyHtml() {
    await navigator.clipboard.writeText(result.html);
  }

  function resetExample() {
    setMarkdown(`# Example Markdown

Convert **Markdown** to HTML.

- Fast
- Clean
- Browser-based

[Example link](https://example.com)
`);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert Markdown to HTML
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert Markdown into clean HTML and preview the rendered output
          instantly in your browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">Markdown input</div>

          <textarea
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            className="min-h-[420px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Write or paste Markdown here..."
          />
        </div>

        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">HTML output</div>

          <textarea
            readOnly
            value={result.html}
            className="min-h-[420px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />
        </div>
      </div>

      <ToolResultBox title="Conversion stats">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Markdown characters" value={result.markdownCharacters.toLocaleString()} />
          <ResultCard label="HTML characters" value={result.htmlCharacters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyHtml} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy HTML
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Install the required package before using this component:
        <br />
        <br />
        <code>npm install marked</code>
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}