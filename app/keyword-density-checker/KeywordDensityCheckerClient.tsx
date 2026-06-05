"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type KeywordItem = {
  keyword: string;
  count: number;
  density: number;
};

const stopWords = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "this",
  "from",
  "your",
  "have",
  "are",
  "was",
  "were",
  "into",
  "about",
  "them",
  "they",
  "will",
  "would",
  "there",
  "their",
  "what",
  "when",
  "where",
  "which",
  "while",
  "been",
  "than",
  "then",
  "also",
  "here",
  "because",
  "could",
  "should",
  "can",
  "using",
  "used",
  "use",
]);

const exampleText = `Toollane provides free online tools for SEO, developers, PDFs and productivity workflows. 
These online tools run directly in the browser and help users work faster without installing software. 
Toollane focuses on speed, usability and privacy-friendly browser tools.`;

function cleanText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function KeywordDensityCheckerClient() {
  const [text, setText] = useState(exampleText);
  const [minLength, setMinLength] = useState(4);
  const [excludeStopWords, setExcludeStopWords] = useState(true);

  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const totalWords = useMemo(() => {
    return cleanText(text)
      .split(" ")
      .filter(Boolean).length;
  }, [text]);

  function analyzeKeywords() {
    setError("");
    setCopied(false);

    if (!text.trim()) {
      setError("Please paste text to analyze.");
      setKeywords([]);
      return;
    }

    const cleaned = cleanText(text);

    const words = cleaned
      .split(" ")
      .filter(Boolean)
      .filter((word) => word.length >= minLength)
      .filter((word) =>
        excludeStopWords ? !stopWords.has(word) : true
      );

    if (!words.length) {
      setError("No valid keywords found.");
      setKeywords([]);
      return;
    }

    const counts = new Map<string, number>();

    for (const word of words) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }

    const result = Array.from(counts.entries())
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: (count / words.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    setKeywords(result);
  }

  async function copyResults() {
    if (!keywords.length) return;

    const content = keywords
      .map(
        (item) =>
          `${item.keyword} — ${item.count} (${formatPercent(
            item.density
          )})`
      )
      .join("\n");

    await navigator.clipboard.writeText(content);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function clearAll() {
    setText("");
    setKeywords([]);
    setError("");
    setCopied(false);
  }

  function loadExample() {
    setText(exampleText);
    setKeywords([]);
    setError("");
    setCopied(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Keyword density checker
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Analyze keyword frequency and keyword density in text content directly
          in your browser. Useful for SEO optimization and content audits.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Text content
          </span>

          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError("");
            }}
            spellCheck={false}
            className="mt-3 min-h-[280px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Paste article, blog post or SEO content here..."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">
              Minimum word length
            </span>

            <select
              value={minLength}
              onChange={(event) =>
                setMinLength(Number(event.target.value))
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value={3}>3 characters</option>
              <option value={4}>4 characters</option>
              <option value={5}>5 characters</option>
              <option value={6}>6 characters</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
            <span>
              <span className="block text-sm font-bold text-black">
                Exclude stop words
              </span>

              <span className="mt-1 block text-xs leading-5 text-black/50">
                Ignore common filler words.
              </span>
            </span>

            <input
              type="checkbox"
              checked={excludeStopWords}
              onChange={(event) =>
                setExcludeStopWords(event.target.checked)
              }
              className="h-5 w-5 accent-black"
            />
          </label>
        </div>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={analyzeKeywords}
            disabled={!text.trim()}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze keywords
          </button>

          <button
            type="button"
            onClick={loadExample}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Load example
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Clear
          </button>
        </div>
      </div>

      {keywords.length > 0 ? (
        <ToolResultBox title="Keyword analysis">
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Total words
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {totalWords}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Keywords found
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {keywords.length}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Top keyword
                </div>

                <div className="mt-2 truncate text-lg font-black text-black">
                  {keywords[0]?.keyword || "-"}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="grid grid-cols-[1fr_100px_100px] border-b border-black/10 px-5 py-4 text-xs font-bold uppercase tracking-wide text-black/40">
                <div>Keyword</div>
                <div>Count</div>
                <div>Density</div>
              </div>

              <div className="divide-y divide-black/10">
                {keywords.map((item) => (
                  <div
                    key={item.keyword}
                    className="grid grid-cols-[1fr_100px_100px] items-center px-5 py-4 text-sm"
                  >
                    <div className="font-semibold text-black">
                      {item.keyword}
                    </div>

                    <div className="text-black/70">
                      {item.count}
                    </div>

                    <div className="font-bold text-black">
                      {formatPercent(item.density)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={copyResults}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy results"}
            </button>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Paste text content and analyze keyword density to identify the most
          frequently used SEO terms.
        </ToolInfoBox>
      )}
    </div>
  );
}