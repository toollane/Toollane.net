"use client";

import { useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function Base64EncoderDecoderClient() {
  const [input, setInput] = useState("Toollane makes online tools faster.");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function encodeBase64() {
    setError("");
    setCopied(false);

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch {
      setError("Could not encode this text.");
      setOutput("");
    }
  }

  function decodeBase64() {
    setError("");
    setCopied(false);

    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
      setOutput(decoded);
    } catch {
      setError("Invalid Base64 input. Please check your text and try again.");
      setOutput("");
    }
  }

  function runTool() {
    if (!input.trim()) {
      setError("Please enter text first.");
      setOutput("");
      return;
    }

    if (mode === "encode") {
      encodeBase64();
    } else {
      decodeBase64();
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

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Base64 encode and decode
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert text to Base64 or decode Base64 back to readable text directly
          in your browser.
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
            {mode === "encode" ? "Text input" : "Base64 input"}
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
                ? "Enter text to encode..."
                : "Enter Base64 to decode..."
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
            {mode === "encode" ? "Encode Base64" : "Decode Base64"}
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
          Choose encode or decode, enter your text and generate the result
          instantly.
        </ToolInfoBox>
      )}
    </div>
  );
}