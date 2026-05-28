"use client";

import { useMemo, useState } from "react";

import { marked } from "marked";

export default function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] =
    useState(`# Hello Toollane

## Markdown Preview

- Fast
- Clean
- SEO Friendly

**Bold Text**
`);

  const html = useMemo(() => {
    return marked.parse(markdown);
  }, [markdown]);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(
      markdown
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">
            Markdown
          </div>

          <button
            onClick={copyMarkdown}
            className="text-sm bg-black text-white rounded-xl px-4 py-2"
          >
            Copy
          </button>
        </div>

        <textarea
          value={markdown}
          onChange={(event) =>
            setMarkdown(
              event.target.value
            )
          }
          rows={20}
          className="w-full border border-black/10 rounded-3xl px-4 py-4 bg-white font-mono"
        />
      </div>

      <div className="grid gap-4">
        <div className="font-semibold">
          Preview
        </div>

        <div
          className="bg-white border border-black/10 rounded-3xl p-6 prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    </div>
  );
}