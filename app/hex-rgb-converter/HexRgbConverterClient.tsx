"use client";

import { useMemo, useState } from "react";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  if (clean.length !== 6) {
    return "";
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  if ([r, g, b].some((value) => isNaN(value))) {
    return "";
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export default function HexRgbConverterClient() {
  const [hex, setHex] = useState("#7c3aed");

  const rgb = useMemo(() => {
    return hexToRgb(hex);
  }, [hex]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">HEX to RGB Converter</h2>

        <p className="text-black/60 leading-7">
          Convert HEX color codes to RGB values instantly for web design and CSS.
        </p>
      </div>

      <input
        type="color"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        className="h-16 w-full rounded-2xl border border-black/10 bg-white"
      />

      <input
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        className="w-full rounded-2xl border border-black/10 px-4 py-4 bg-white"
      />

      <div
        className="h-40 rounded-[2rem] border border-black/10"
        style={{ background: hex }}
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">RGB Value</div>

        <div className="text-2xl font-bold break-words">
          {rgb || "Invalid HEX"}
        </div>
      </div>
    </div>
  );
}