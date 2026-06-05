"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type JsonStats = {
  size: number;
  keys: number;
  arrays: number;
  objects: number;
};

function countJsonStats(value: unknown): Omit<JsonStats, "size"> {
  let keys = 0;
  let arrays = 0;
  let objects = 0;

  function walk(item: unknown) {
    if (Array.isArray(item)) {
      arrays += 1;
      item.forEach(walk);
      return;
    }

    if (item !== null && typeof item === "object") {
      objects += 1;

      for (const [key, child] of Object.entries(item)) {
        keys += 1;
        walk(child);
      }
    }
  }

  walk(value);

  return {
    keys,
    arrays,
    objects,
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const exampleJson = `{
  "name": "Toollane",
  "type": "online tools",
  "features": ["fast", "free", "browser-based"],
  "privacyFriendly": true
}`;

export default function JsonFormatterClient() {
  const [input, setInput] = useState(exampleJson);
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const canFormat = useMemo(() => input.trim().length > 0, [input]);

  function sortObjectKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(sortObjectKeys);
    }

    if (value !== null && typeof value === "object") {
      return Object.keys(value as Record<string, unknown>)
        .sort((a, b) => a.localeCompare(b))
        .reduce<Record<string, unknown>>((accumulator, key) => {
          accumulator[key] = sortObjectKeys(
            (value as Record<string, unknown>)[key]
          );

          return accumulator;
        }, {});
    }

    return value;
  }

  function formatJson() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste JSON before formatting.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const finalJson = sortKeys ? sortObjectKeys(parsed) : parsed;
      const formatted = JSON.stringify(finalJson, null, indent);
      const jsonStats = countJsonStats(parsed);

      setOutput(formatted);
      setStats({
        ...jsonStats,
        size: new Blob([formatted]).size,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(`Invalid JSON: ${error.message}`);
      } else {
        setError("Invalid JSON. Please check your syntax and try again.");
      }

      setOutput("");
      setStats(null);
    }
  }

  function minifyJson() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste JSON before minifying.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const finalJson = sortKeys ? sortObjectKeys(parsed) : parsed;
      const minified = JSON.stringify(finalJson);
      const jsonStats = countJsonStats(parsed);

      setOutput(minified);
      setStats({
        ...jsonStats,
        size: new Blob([minified]).size,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(`Invalid JSON: ${error.message}`);
      } else {
        setError("Invalid JSON. Please check your syntax and try again.");
      }

      setOutput("");
      setStats(null);
    }
  }

  async function copyOutput() {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setStats(null);
    setCopied(false);
    setError("");
  }

  function loadExample() {
    setInput(exampleJson);
    setOutput("");
    setStats(null);
    setCopied(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Format and validate JSON
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Paste JSON to format, validate, minify and optionally sort object keys.
          Everything runs directly in your browser.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">JSON input</span>

          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
            }}
            spellCheck={false}
            className="mt-3 min-h-[280px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder='Paste JSON here, for example: {"name":"Toollane"}'
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Indentation</span>

            <select
              value={indent}
              onChange={(event) => setIndent(Number(event.target.value))}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
            <span>
              <span className="block text-sm font-bold text-black">
                Sort object keys
              </span>

              <span className="mt-1 block text-xs leading-5 text-black/50">
                Useful for comparing JSON files.
              </span>
            </span>

            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(event) => setSortKeys(event.target.checked)}
              className="h-5 w-5 accent-black"
            />
          </label>
        </div>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={formatJson}
            disabled={!canFormat}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Format JSON
          </button>

          <button
            type="button"
            onClick={minifyJson}
            disabled={!canFormat}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Minify JSON
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

      {output ? (
        <ToolResultBox title="Formatted output">
          <div className="grid gap-5">
            {stats && (
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Size
                  </div>

                  <div className="mt-2 text-lg font-black text-black">
                    {formatBytes(stats.size)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Keys
                  </div>

                  <div className="mt-2 text-lg font-black text-black">
                    {stats.keys}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Objects
                  </div>

                  <div className="mt-2 text-lg font-black text-black">
                    {stats.objects}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Arrays
                  </div>

                  <div className="mt-2 text-lg font-black text-black">
                    {stats.arrays}
                  </div>
                </div>
              </div>
            )}

            <pre className="max-h-[520px] overflow-auto rounded-2xl border border-black/10 bg-white p-5 text-left font-mono text-sm leading-7 text-black">
              <code>{output}</code>
            </pre>

            <button
              type="button"
              onClick={copyOutput}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy output"}
            </button>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Paste JSON and click format to validate syntax and generate readable
          output. Invalid JSON errors are shown immediately after formatting.
        </ToolInfoBox>
      )}
    </div>
  );
}