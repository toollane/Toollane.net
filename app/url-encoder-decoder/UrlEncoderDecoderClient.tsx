"use client";

import { useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function UrlEncoderDecoderClient() {
  const [input, setInput] = useState(
    "https://toollane.net/search?q=free online tools&category=seo tools"
  );
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function runTool() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter a URL or text first.");
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError(
        mode === "encode"
          ? "Could not encode this input."
          : "Invalid encoded URL input. Please check your text and try again."
      );
      setOutput("");
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
    setError("");
    setCopied(false);
  }

  function loadExample() {
    setInput(
      mode === "encode"
        ? "https://toollane.net/search?q=free online tools&category=seo tools"
        : "https%3A%2F%2Ftoollane.net%2Fsearch%3Fq%3Dfree%20online%20tools%26category%3Dseo%20tools"
    );
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          URL encode and decode
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Encode URLs for safe use in query strings or decode encoded URLs back
          into readable text directly in your browser.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setMode("encode");
              setOutput("");
              setError("");
            }}
            className={`rounded-2xl px-6 py-4 text-sm font-bold transition ${
              mode === "encode"
                ? "bg-black text-white"
                : "border border-black/10 bg-white text-black hover:bg-black/5"
            }`}
          >
            Encode
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("decode");
              setOutput("");
              setError("");
            }}
            className={`rounded-2xl px-6 py-4 text-sm font-bold transition ${
              mode === "decode"
                ? "bg-black text-white"
                : "border border-black/10 bg-white text-black hover:bg-black/5"
            }`}
          >
            Decode
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">
            {mode === "encode" ? "URL or text input" : "Encoded URL input"}
          </span>

          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
            }}
            spellCheck={false}
            className="mt-3 min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder={
              mode === "encode"
                ? "Enter URL or text to encode..."
                : "Enter encoded URL or text to decode..."
            }
          />
        </label>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={runTool}
            disabled={!input.trim()}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mode === "encode" ? "Encode URL" : "Decode URL"}
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
        <ToolResultBox title="Result">
          <pre className="max-h-[420px] overflow-auto rounded-2xl border border-black/10 bg-white p-5 text-left font-mono text-sm leading-7 text-black">
            <code>{output}</code>
          </pre>

          <button
            type="button"
            onClick={copyOutput}
            className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy result"}
          </button>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Use URL encoding for query parameters, links and API requests. Decode
          encoded URLs when you need readable text again.
        </ToolInfoBox>
      )}
    </div>
  );
}