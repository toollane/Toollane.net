"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function convertHtmlToMarkdown(html: string) {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, "### $1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gis, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gis, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gis, "*$1*")
    .replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gis, "[$2]($1)")
    .replace(/<li[^>]*>(.*?)<\/li>/gis, "- $1\n")
    .replace(/<\/ul>|<ul[^>]*>|<\/ol>|<ol[^>]*>/gis, "\n")
    .replace(/<br\s*\/?>/gis, "\n")
    .replace(/<\/p>/gis, "\n\n")
    .replace(/<p[^>]*>/gis, "")
    .replace(/<code[^>]*>(.*?)<\/code>/gis, "`$1`")
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, "```\n$1\n```\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function HtmlToMarkdownClient() {
  const [html, setHtml] = useState(`<h1>Example HTML</h1>
<p>Convert <strong>HTML</strong> into Markdown.</p>
<ul>
  <li>Fast</li>
  <li>Clean</li>
</ul>
<p><a href="https://example.com">Example link</a></p>`);

  const result = useMemo(() => {
    const markdown = convertHtmlToMarkdown(html);
    const words = markdown.match(/\b[\w'-]+\b/g) || [];

    return {
      markdown,
      htmlCharacters: html.length,
      markdownCharacters: markdown.length,
      words: words.length,
      lines: markdown ? markdown.split("\n").length : 0,
    };
  }, [html]);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(result.markdown);
  }

  function resetExample() {
    setHtml(`<h1>Example HTML</h1>
<p>Convert <strong>HTML</strong> into Markdown.</p>
<ul>
  <li>Fast</li>
  <li>Clean</li>
</ul>
<p><a href="https://example.com">Example link</a></p>`);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert HTML to Markdown
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert common HTML tags into readable Markdown for docs, editors,
          CMS imports and content cleanup.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">HTML input</div>

          <textarea
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            className="min-h-[420px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Paste HTML here..."
          />
        </div>

        <div className="grid gap-4">
          <div className="text-sm font-bold text-black">Markdown output</div>

          <textarea
            readOnly
            value={result.markdown}
            className="min-h-[420px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />
        </div>
      </div>

      <ToolResultBox title="Conversion stats">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="HTML characters" value={result.htmlCharacters.toLocaleString()} />
          <ResultCard label="Markdown characters" value={result.markdownCharacters.toLocaleString()} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Lines" value={result.lines.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyMarkdown} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy Markdown
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        This converter supports common content HTML such as headings,
        paragraphs, lists, links, emphasis and code snippets.
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