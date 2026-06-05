"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";
import ToolInfoBox from "@/components/ToolInfoBox";

type GradientType = "linear" | "radial";

export default function CssGradientGeneratorClient() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#3B82F6");
  const [color2, setColor2] = useState("#EC4899");
  const [color3, setColor3] = useState("#F59E0B");
  const [useThirdColor, setUseThirdColor] = useState(false);

  const css = useMemo(() => {
    const colors = useThirdColor
      ? `${color1}, ${color2}, ${color3}`
      : `${color1}, ${color2}`;

    if (type === "radial") {
      return `background: radial-gradient(circle, ${colors});`;
    }

    return `background: linear-gradient(${angle}deg, ${colors});`;
  }, [type, angle, color1, color2, color3, useThirdColor]);

  const previewBackground = css.replace("background: ", "").replace(";", "");

  async function copyCss() {
    await navigator.clipboard.writeText(css);
  }

  function resetExample() {
    setType("linear");
    setAngle(135);
    setColor1("#3B82F6");
    setColor2("#EC4899");
    setColor3("#F59E0B");
    setUseThirdColor(false);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate CSS gradients
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create linear and radial CSS gradients with live preview, custom colors
          and copy-ready CSS.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">Gradient type</span>

          <select
            value={type}
            onChange={(event) => setType(event.target.value as GradientType)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="linear">Linear gradient</option>
            <option value="radial">Radial gradient</option>
          </select>
        </label>

        {type === "linear" && (
          <label className="block">
            <span className="text-sm font-bold text-black">
              Angle: {angle}°
            </span>

            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
              className="mt-5 w-full"
            />
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ColorInput label="Start color" value={color1} onChange={setColor1} />
        <ColorInput label="End color" value={color2} onChange={setColor2} />

        {useThirdColor && (
          <ColorInput label="Middle color" value={color3} onChange={setColor3} />
        )}
      </div>

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
        <span className="text-sm font-bold text-black">Use third color</span>

        <input
          type="checkbox"
          checked={useThirdColor}
          onChange={(event) => setUseThirdColor(event.target.checked)}
          className="h-5 w-5 accent-black"
        />
      </label>

      <div
        style={{ background: previewBackground }}
        className="min-h-[280px] rounded-[2rem] border border-black/10"
      />

      <ToolResultBox title="Generated CSS">
        <textarea
          readOnly
          value={css}
          className="min-h-[140px] w-full resize-none rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
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
        CSS gradients are useful for landing pages, hero sections, buttons,
        cards, app backgrounds and brand visuals.
      </ToolInfoBox>
    </div>
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

      <div className="mt-3 flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[54px] w-[70px] rounded-2xl border border-black/10 bg-white"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-black"
        />
      </div>
    </label>
  );
}