"use client";

import { useMemo, useState } from "react";

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase()}`;
}

export default function RandomColorPaletteGeneratorClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  const colors = useMemo(() => {
    return Array.from({ length: 5 }, () => randomColor());
  }, [refreshKey]);

  const copyPalette = async () => {
    await navigator.clipboard.writeText(colors.join(", "));
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Random Color Palette Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate random color palettes for websites, brands, designs, apps and creative projects.
        </p>
      </div>

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Palette
      </button>

      <div className="grid md:grid-cols-5 gap-4">
        {colors.map((color) => (
          <div
            key={color}
            className="rounded-3xl border border-black/10 overflow-hidden bg-white"
          >
            <div
              className="h-36"
              style={{ background: color }}
            />

            <div className="p-4 font-bold text-center">
              {color}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={copyPalette}
        className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
      >
        Copy Palette
      </button>
    </div>
  );
}