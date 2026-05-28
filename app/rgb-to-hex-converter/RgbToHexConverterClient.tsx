"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

function toHex(value: number) {
  return Math.max(0, Math.min(255, value))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

export default function RgbToHexConverterClient() {
  const [red, setRed] = useState("124");
  const [green, setGreen] = useState("58");
  const [blue, setBlue] = useState("237");

  const hex = useMemo(() => {
    const r = parseInt(red, 10);
    const g = parseInt(green, 10);
    const b = parseInt(blue, 10);

    if ([r, g, b].some((value) => isNaN(value))) {
      return "";
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, [red, green, blue]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">RGB to HEX Converter</h2>

        <p className="text-black/60 leading-7">
          Convert RGB color values into HEX color codes instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <NumberInput label="Red" value={red} onChange={setRed} placeholder="124" />
        <NumberInput label="Green" value={green} onChange={setGreen} placeholder="58" />
        <NumberInput label="Blue" value={blue} onChange={setBlue} placeholder="237" />
      </div>

      {hex && (
        <div
          className="h-40 rounded-[2rem] border border-black/10"
          style={{ background: hex }}
        />
      )}

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">HEX Value</div>

        <div className="text-3xl font-bold break-words">
          {hex || "Invalid RGB"}
        </div>
      </div>
    </div>
  );
}