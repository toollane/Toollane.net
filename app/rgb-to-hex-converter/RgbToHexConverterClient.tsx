"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolResultBox from "@/components/ToolResultBox";

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.max(0, Math.min(255, value))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  ).toUpperCase();
}

export default function RgbToHexConverterClient() {
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      [r, g, b].some(
        (value) => value < 0 || value > 255
      )
    ) {
      return null;
    }

    const hex = rgbToHex(r, g, b);

    return {
      hex,
      css: `rgb(${r}, ${g}, ${b})`,
    };
  }, [r, g, b]);

  function validateInputs() {
    if (
      [r, g, b].some(
        (value) => value < 0 || value > 255
      )
    ) {
      setError(
        "RGB values must be between 0 and 255."
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
    setR(59);
    setG(130);
    setB(246);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert RGB to HEX
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert RGB color values into HEX codes for
          CSS, UI systems, websites and branding
          projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberInput
          label="Red"
          value={r}
          onChange={setR}
          onBlur={validateInputs}
        />

        <NumberInput
          label="Green"
          value={g}
          onChange={setG}
          onBlur={validateInputs}
        />

        <NumberInput
          label="Blue"
          value={b}
          onChange={setB}
          onBlur={validateInputs}
        />
      </div>

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
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="HEX"
                value={result.hex}
                onCopy={() =>
                  copyValue(result.hex)
                }
              />

              <ResultCard
                label="CSS"
                value={result.css}
                onCopy={() =>
                  copyValue(result.css)
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

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        type="number"
        min="0"
        max="255"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
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