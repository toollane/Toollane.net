"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function BoxShadowGeneratorClient() {
  const [x, setX] = useState("0");
  const [y, setY] = useState("10");
  const [blur, setBlur] = useState("30");
  const [spread, setSpread] = useState("0");
  const [color, setColor] = useState("#000000");

  const boxShadow = useMemo(() => {
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }, [x, y, blur, spread, color]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CSS Box Shadow Generator</h2>

        <p className="text-black/60 leading-7">
          Create CSS box shadows visually and copy the generated CSS code.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <NumberInput label="X Offset" value={x} onChange={setX} placeholder="0" />
        <NumberInput label="Y Offset" value={y} onChange={setY} placeholder="10" />
        <NumberInput label="Blur" value={blur} onChange={setBlur} placeholder="30" />
        <NumberInput label="Spread" value={spread} onChange={setSpread} placeholder="0" />
      </div>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="h-16 w-full rounded-2xl border border-black/10 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-[2rem] p-16 flex justify-center">
        <div
          className="w-48 h-48 rounded-3xl bg-[#fff8df]"
          style={{ boxShadow }}
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">CSS Code</div>

        <pre className="whitespace-pre-wrap break-words text-sm">
{`box-shadow: ${boxShadow};`}
        </pre>
      </div>
    </div>
  );
}