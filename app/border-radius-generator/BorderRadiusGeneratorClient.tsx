"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function BorderRadiusGeneratorClient() {
  const [topLeft, setTopLeft] = useState("24");
  const [topRight, setTopRight] = useState("24");
  const [bottomRight, setBottomRight] = useState("24");
  const [bottomLeft, setBottomLeft] = useState("24");

  const css = useMemo(() => {
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }, [topLeft, topRight, bottomRight, bottomLeft]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CSS Border Radius Generator</h2>
        <p className="text-black/60 leading-7">
          Create custom rounded corners visually and copy the generated CSS.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <NumberInput label="Top Left" value={topLeft} onChange={setTopLeft} placeholder="24" />
        <NumberInput label="Top Right" value={topRight} onChange={setTopRight} placeholder="24" />
        <NumberInput label="Bottom Right" value={bottomRight} onChange={setBottomRight} placeholder="24" />
        <NumberInput label="Bottom Left" value={bottomLeft} onChange={setBottomLeft} placeholder="24" />
      </div>

      <div className="bg-white border border-black/10 rounded-[2rem] p-12 flex justify-center">
        <div
          className="w-56 h-56 bg-black"
          style={{ borderRadius: css }}
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">CSS Code</div>
        <pre className="whitespace-pre-wrap break-words text-sm">
{`border-radius: ${css};`}
        </pre>
      </div>
    </div>
  );
}