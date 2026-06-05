"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function BoxShadowGeneratorClient() {
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(16);
  const [blur, setBlur] = useState(40);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(20);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [boxColor, setBoxColor] = useState("#FFFFFF");
  const [inset, setInset] = useState(false);

  const css = useMemo(() => {
    const alpha = Math.min(Math.max(opacity, 0), 100) / 100;

    const r = parseInt(shadowColor.slice(1, 3), 16);
    const g = parseInt(shadowColor.slice(3, 5), 16);
    const b = parseInt(shadowColor.slice(5, 7), 16);

    return `box-shadow: ${inset ? "inset " : ""}${xOffset}px ${yOffset}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${alpha});`;
  }, [xOffset, yOffset, blur, spread, opacity, shadowColor, inset]);

  async function copyCss() {
    await navigator.clipboard.writeText(css);
  }

  function resetExample() {
    setXOffset(0);
    setYOffset(16);
    setBlur(40);
    setSpread(0);
    setOpacity(20);
    setShadowColor("#000000");
    setBoxColor("#FFFFFF");
    setInset(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate box shadow CSS
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create custom CSS box shadows for cards, buttons, modals and modern UI
          components.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RangeInput label="X offset" value={xOffset} min={-100} max={100} onChange={setXOffset} />
        <RangeInput label="Y offset" value={yOffset} min={-100} max={100} onChange={setYOffset} />
        <RangeInput label="Blur" value={blur} min={0} max={150} onChange={setBlur} />
        <RangeInput label="Spread" value={spread} min={-80} max={80} onChange={setSpread} />
        <RangeInput label="Opacity" value={opacity} min={0} max={100} onChange={setOpacity} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ColorInput label="Shadow color" value={shadowColor} onChange={setShadowColor} />
        <ColorInput label="Box color" value={boxColor} onChange={setBoxColor} />

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 sm:mt-8">
          <span className="text-sm font-bold text-black">Inset shadow</span>

          <input
            type="checkbox"
            checked={inset}
            onChange={(event) => setInset(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>
      </div>

      <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] border border-black/10 bg-[#f6f6f6] p-10">
        <div
          style={{
            backgroundColor: boxColor,
            boxShadow: css.replace("box-shadow: ", "").replace(";", ""),
          }}
          className="flex h-56 w-56 items-center justify-center rounded-[2rem] text-sm font-black text-black"
        >
          Preview
        </div>
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
        Subtle shadows improve depth and hierarchy in user interfaces. Stronger
        shadows can work well for modals, overlays and floating cards.
      </ToolInfoBox>
    </div>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}: {value}
      </span>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
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