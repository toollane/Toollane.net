"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolResultBox from "@/components/ToolResultBox";

function normalizeHex(value: string) {
  let hex = value.trim().replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  return hex.toUpperCase();
}

function isValidHex(hex: string) {
  return /^[0-9A-F]{6}$/i.test(hex);
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export default function HexRgbConverterClient() {
  const [hex, setHex] = useState("#3B82F6");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const normalized = normalizeHex(hex);

    if (!isValidHex(normalized)) {
      return null;
    }

    const rgb = hexToRgb(normalized);

    return {
      hex: `#${normalized}`,
      rgb,
      css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    };
  }, [hex]);

  function validateInput() {
    const normalized = normalizeHex(hex);

    if (!isValidHex(normalized)) {
      setError(
        "Enter a valid HEX color like #FF5733 or #FFF."
      );

      return false;
    }

    setError("");
    return true;
  }

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
  }

  function resetExample() {
    setHex("#3B82F6");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert HEX to RGB
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert HEX colors into RGB values for CSS,
          design systems, branding and frontend
          development.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          HEX color
        </span>

        <input
          value={hex}
          onChange={(event) => {
            setHex(event.target.value);
            setError("");
          }}
          onBlur={validateInput}
          placeholder="#3B82F6"
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-black"
        />
      </label>

      {error && <ToolErrorBox message={error} />}

      {result && (
        <>
          <div
            style={{
              backgroundColor: result.hex,
            }}
            className="h-48 rounded-[2rem] border border-black/10"
          />

          <ToolResultBox title="Converted color">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="HEX"
                value={result.hex}
                onCopy={() => copyValue(result.hex)}
              />

              <ResultCard
                label="RGB"
                value={result.css}
                onCopy={() => copyValue(result.css)}
              />

              <ResultCard
                label="CSS"
                value={`color: ${result.css};`}
                onCopy={() =>
                  copyValue(`color: ${result.css};`)
                }
              />
            </div>
          </ToolResultBox>
        </>
      )}

      <button
        type="button"
        onClick={resetExample}
        className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
      >
        Reset
      </button>
    </div>
  );
}

function ResultCard({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 break-all font-mono text-sm font-bold text-black">
        {value}
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="mt-4 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black transition hover:bg-black/5"
      >
        Copy
      </button>
    </div>
  );
}