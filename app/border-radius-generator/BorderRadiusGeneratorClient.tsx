"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function BorderRadiusGeneratorClient() {
  const [topLeft, setTopLeft] = useState(32);
  const [topRight, setTopRight] = useState(32);
  const [bottomRight, setBottomRight] = useState(32);
  const [bottomLeft, setBottomLeft] = useState(32);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState("px");
  const [backgroundColor, setBackgroundColor] = useState("#3B82F6");

  const css = useMemo(() => {
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  }, [topLeft, topRight, bottomRight, bottomLeft, unit]);

  function updateAll(value: number) {
    setTopLeft(value);

    if (linked) {
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    }
  }

  async function copyCss() {
    await navigator.clipboard.writeText(css);
  }

  function resetExample() {
    setTopLeft(32);
    setTopRight(32);
    setBottomRight(32);
    setBottomLeft(32);
    setLinked(true);
    setUnit("px");
    setBackgroundColor("#3B82F6");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate border radius CSS
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create custom border-radius CSS with linked or individual corner
          controls and live preview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-bold text-black">Unit</span>

          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="rem">rem</option>
          </select>
        </label>

        <ColorInput
          label="Preview color"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 sm:mt-8">
          <span className="text-sm font-bold text-black">Link corners</span>

          <input
            type="checkbox"
            checked={linked}
            onChange={(event) => setLinked(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RangeInput label="Top left" value={topLeft} onChange={updateAll} />
        <RangeInput label="Top right" value={topRight} onChange={setTopRight} disabled={linked} />
        <RangeInput label="Bottom right" value={bottomRight} onChange={setBottomRight} disabled={linked} />
        <RangeInput label="Bottom left" value={bottomLeft} onChange={setBottomLeft} disabled={linked} />
      </div>

      <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-black/10 bg-white p-8">
        <div
          style={{
            backgroundColor,
            borderRadius: `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`,
          }}
          className="h-56 w-full max-w-md shadow-sm"
        />
      </div>

      <ToolResultBox title="Generated CSS">
        <textarea
          readOnly
          value={css}
          className="min-h-[120px] w-full resize-none rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyCss}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy CSS
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Border radius is useful for cards, buttons, images, modals, product
        blocks and modern UI components.
      </ToolInfoBox>
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`block ${disabled ? "opacity-50" : ""}`}>
      <span className="text-sm font-bold text-black">
        {label}: {value}
      </span>

      <input
        type="range"
        min="0"
        max="200"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full"
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-[54px] w-full rounded-2xl border border-black/10 bg-white"
      />
    </label>
  );
}