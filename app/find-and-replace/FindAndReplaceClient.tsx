"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function FindAndReplaceClient() {
  const [text, setText] = useState(
    "This sample text contains sample words. Replace sample with something better."
  );
  const [findValue, setFindValue] = useState("sample");
  const [replaceValue, setReplaceValue] = useState("example");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWordsOnly, setWholeWordsOnly] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!findValue) {
      return {
        output: text,
        matches: 0,
      };
    }

    try {
      let pattern = findValue;

      if (!useRegex) {
        pattern = findValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      if (wholeWordsOnly) {
        pattern = `\\b${pattern}\\b`;
      }

      const flags = caseSensitive ? "g" : "gi";
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex) || [];

      return {
        output: text.replace(regex, replaceValue),
        matches: matches.length,
      };
    } catch {
      return null;
    }
  }, [text, findValue, replaceValue, caseSensitive, wholeWordsOnly, useRegex]);

  function validateInputs() {
    if (!findValue) {
      setError("Find value cannot be empty.");
      return false;
    }

    if (useRegex) {
      try {
        new RegExp(findValue);
      } catch {
        setError("Invalid regular expression.");
        return false;
      }
    }

    setError("");
    return true;
  }

  async function copyResult() {
    if (result) {
      await navigator.clipboard.writeText(result.output);
    }
  }

  function resetExample() {
    setText("This sample text contains sample words. Replace sample with something better.");
    setFindValue("sample");
    setReplaceValue("example");
    setCaseSensitive(false);
    setWholeWordsOnly(false);
    setUseRegex(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Find and replace text
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Find and replace words, phrases or regex patterns with case-sensitive
          and whole-word options.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste or type text here..."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">Find</span>

          <input
            value={findValue}
            onChange={(event) => {
              setFindValue(event.target.value);
              setError("");
            }}
            onBlur={validateInputs}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">Replace with</span>

          <input
            value={replaceValue}
            onChange={(event) => setReplaceValue(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Toggle label="Case sensitive" checked={caseSensitive} onChange={setCaseSensitive} />
        <Toggle label="Whole words only" checked={wholeWordsOnly} onChange={setWholeWordsOnly} />
        <Toggle label="Use regex" checked={useRegex} onChange={setUseRegex} />
      </div>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <ToolResultBox title="Replacement result">
          <textarea
            readOnly
            value={result.output}
            className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ResultCard label="Matches found" value={result.matches.toLocaleString()} />
            <ResultCard label="Characters" value={result.output.length.toLocaleString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter a valid find value or regular expression.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} disabled={!result} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
          Copy result
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
      />
    </label>
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
    <div className="rounded-2xl border border-black/10 bg-white p-5 text-black">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}