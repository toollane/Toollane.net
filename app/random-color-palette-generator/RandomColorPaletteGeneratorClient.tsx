"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PaletteStyle =
  | "random"
  | "pastel"
  | "vibrant"
  | "dark"
  | "light";

function randomHex() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`.toUpperCase();
}

function randomPastel() {
  const r = Math.floor((Math.random() * 127) + 127);
  const g = Math.floor((Math.random() * 127) + 127);
  const b = Math.floor((Math.random() * 127) + 127);

  return rgbToHex(r, g, b);
}

function randomDark() {
  const r = Math.floor(Math.random() * 100);
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);

  return rgbToHex(r, g, b);
}

function randomLight() {
  const r = Math.floor((Math.random() * 55) + 200);
  const g = Math.floor((Math.random() * 55) + 200);
  const b = Math.floor((Math.random() * 55) + 200);

  return rgbToHex(r, g, b);
}

function randomVibrant() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return rgbToHex(r, g, b);
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        value.toString(16).padStart(2, "0")
      )
      .join("")
  ).toUpperCase();
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  const bigint = parseInt(clean, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export default function RandomColorPaletteGeneratorClient() {
  const [count, setCount] = useState(5);

  const [style, setStyle] =
    useState<PaletteStyle>("random");

  const [refreshKey, setRefreshKey] = useState(0);

  const colors = useMemo(() => {
    const safeCount = Math.min(
      Math.max(count, 2),
      12
    );

    return Array.from({ length: safeCount }, () => {
      switch (style) {
        case "pastel":
          return randomPastel();

        case "vibrant":
          return randomVibrant();

        case "dark":
          return randomDark();

        case "light":
          return randomLight();

        default:
          return randomHex();
      }
    });
  }, [count, style, refreshKey]);

  async function copyColor(color: string) {
    await navigator.clipboard.writeText(color);
  }

  async function copyPalette() {
    await navigator.clipboard.writeText(
      colors.join(", ")
    );
  }

  function downloadPalette() {
    const blob = new Blob([colors.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "color-palette.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  function generateNewPalette() {
    setRefreshKey((value) => value + 1);
  }

  function resetExample() {
    setCount(5);
    setStyle("random");
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate random color palettes
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate random, pastel, vibrant, dark and
          light color palettes for UI design, branding,
          websites and creative projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Number of colors
          </span>

          <input
            type="number"
            min="2"
            max="12"
            value={count}
            onChange={(event) =>
              setCount(Number(event.target.value))
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Palette style
          </span>

          <select
            value={style}
            onChange={(event) =>
              setStyle(
                event.target.value as PaletteStyle
              )
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="random">Random</option>
            <option value="pastel">Pastel</option>
            <option value="vibrant">Vibrant</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
      </div>

      <ToolResultBox title="Generated palette">
        <div className="grid overflow-hidden rounded-[2rem] border border-black/10 sm:grid-cols-5">
          {colors.map((color) => {
            const rgb = hexToRgb(color);

            return (
              <div
                key={color}
                style={{
                  backgroundColor: color,
                }}
                className="flex min-h-[220px] flex-col justify-end p-5"
              >
                <div className="rounded-2xl bg-white/90 p-4 backdrop-blur">
                  <div className="font-black text-black">
                    {color}
                  </div>

                  <div className="mt-2 text-xs text-black/60">
                    RGB({rgb.r}, {rgb.g}, {rgb.b})
                  </div>

                  <button
                    type="button"
                    onClick={() => copyColor(color)}
                    className="mt-4 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black transition hover:bg-black/5"
                  >
                    Copy color
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={generateNewPalette}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Generate new palette
        </button>

        <button
          type="button"
          onClick={copyPalette}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy palette
        </button>

        <button
          type="button"
          onClick={downloadPalette}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Download palette
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Color palettes are generated locally in the
        browser and can be used for websites, UI kits,
        branding systems, social media graphics and
        creative design workflows.
      </ToolInfoBox>
    </div>
  );
}