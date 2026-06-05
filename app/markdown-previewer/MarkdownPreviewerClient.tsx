"use client";

import { useMemo, useState } from "react";

import { marked } from "marked";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] = useState(`# Markdown Preview

## Example heading

- Bullet point
- Another bullet point

**Bold text** and *italic text*

[Example link](https://example.com)

\`\`\`js
console.log("Hello world");
\`\`\`
`);

  const result = useMemo(() => {
    const html = marked.parse(markdown) as string;

    const words = markdown.match(/\b[\w'-]+\b/g) || [];

    return {
      html,
      characters: markdown.length,
      words: words.length,
      lines: markdown.split("\n").length,
    };
  }, [markdown]);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
  }

  function resetExample() {
    setMarkdown(`# Markdown Preview

## Example heading

- Bullet point
- Another bullet point

**Bold text** and *italic text*

[Example link](https://example.com)

\`\`\`js
console.log("Hello world");
\`\`\`
`);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Preview Markdown online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Write Markdown and instantly preview formatted HTML content including
          headings, lists, code blocks and links.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">
            Markdown input
          </div>

          <textarea
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            className="min-h-[500px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Write Markdown here..."
          />
        </div>

        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">
            Live preview
          </div>

          <div
            className="prose prose-neutral max-w-none rounded-[2rem] border border-black/10 bg-white px-6 py-6"
            dangerouslySetInnerHTML={{
              __html: result.html,
            }}
          />
        </div>
      </div>

      <ToolResultBox title="Markdown statistics">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyMarkdown}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy Markdown
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
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

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}