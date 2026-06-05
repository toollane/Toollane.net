"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type MatchItem = {
  value: string;
  index: number;
};

const examplePattern = "\\b\\w+@\\w+\\.\\w+\\b";

const exampleText = `hello@toollane.net
support@example.com
invalid-email
another@test.org`;

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState(examplePattern);
  const [flags, setFlags] = useState("gm");
  const [text, setText] = useState(exampleText);

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canRun = useMemo(() => {
    return pattern.trim().length > 0 && text.trim().length > 0;
  }, [pattern, text]);

  function runRegex() {
    setError("");
    setCopied(false);

    if (!pattern.trim()) {
      setError("Please enter a regex pattern.");
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches: MatchItem[] = [];

      if (flags.includes("g")) {
        for (const match of text.matchAll(regex)) {
          foundMatches.push({
            value: match[0],
            index: match.index || 0,
          });
        }
      } else {
        const match = regex.exec(text);

        if (match) {
          foundMatches.push({
            value: match[0],
            index: match.index || 0,
          });
        }
      }

      setMatches(foundMatches);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid regular expression.");
      }

      setMatches([]);
    }
  }

  async function copyMatches() {
    if (!matches.length) return;

    await navigator.clipboard.writeText(
      matches.map((match) => match.value).join("\n")
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function clearAll() {
    setPattern("");
    setFlags("gm");
    setText("");
    setMatches([]);
    setError("");
    setCopied(false);
  }

  function loadExample() {
    setPattern(examplePattern);
    setFlags("gm");
    setText(exampleText);
    setMatches([]);
    setError("");
    setCopied(false);
  }

  const highlightedText = useMemo(() => {
    if (!matches.length) {
      return text;
    }

    try {
      const regex = new RegExp(pattern, flags);

      const segments: React.ReactNode[] = [];
      let lastIndex = 0;

      for (const match of text.matchAll(regex)) {
        const start = match.index || 0;
        const end = start + match[0].length;

        segments.push(text.slice(lastIndex, start));

        segments.push(
          <mark
            key={`${start}-${end}`}
            className="rounded bg-yellow-300 px-1 text-black"
          >
            {match[0]}
          </mark>
        );

        lastIndex = end;

        if (!flags.includes("g")) {
          break;
        }
      }

      segments.push(text.slice(lastIndex));

      return segments;
    } catch {
      return text;
    }
  }, [matches, text, pattern, flags]);

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Test regular expressions
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Enter a regex pattern and test it instantly against text input
          directly in your browser.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <label className="block">
            <span className="text-sm font-bold text-black">
              Regex pattern
            </span>

            <input
              value={pattern}
              onChange={(event) => {
                setPattern(event.target.value);
                setError("");
              }}
              spellCheck={false}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-black"
              placeholder="Example: \\d+"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Flags
            </span>

            <input
              value={flags}
              onChange={(event) => {
                setFlags(event.target.value);
                setError("");
              }}
              spellCheck={false}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-black"
              placeholder="gm"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Test text
          </span>

          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError("");
            }}
            spellCheck={false}
            className="mt-3 min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Paste or type text here..."
          />
        </label>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={runRegex}
            disabled={!canRun}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Run regex
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

      {matches.length > 0 ? (
        <ToolResultBox title="Regex matches">
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Matches
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {matches.length}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Pattern length
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {pattern.length}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Flags
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {flags || "none"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5 font-mono text-sm leading-7 text-black">
              {highlightedText}
            </div>

            <div className="grid gap-3">
              {matches.map((match, index) => (
                <div
                  key={`${match.index}-${index}`}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Match #{index + 1}
                  </div>

                  <div className="mt-2 break-all font-mono text-sm text-black">
                    {match.value}
                  </div>

                  <div className="mt-2 text-xs text-black/50">
                    Position: {match.index}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={copyMatches}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy matches"}
            </button>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter a regex pattern and test it against text. Matches will be
          highlighted and listed below.
        </ToolInfoBox>
      )}
    </div>
  );
}