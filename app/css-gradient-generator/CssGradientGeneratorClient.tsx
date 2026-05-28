"use client";

import { useMemo, useState } from "react";

export default function CssGradientGeneratorClient() {
  const [color1, setColor1] =
    useState("#7c3aed");

  const [color2, setColor2] =
    useState("#06b6d4");

  const [direction, setDirection] =
    useState("90");

  const gradient = useMemo(() => {
    return `linear-gradient(${direction}deg, ${color1}, ${color2})`;
  }, [color1, color2, direction]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          CSS Gradient Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create beautiful CSS gradients and copy the generated CSS code instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="color"
          value={color1}
          onChange={(e) =>
            setColor1(e.target.value)
          }
          className="h-16 w-full rounded-2xl border border-black/10 bg-white"
        />

        <input
          type="color"
          value={color2}
          onChange={(e) =>
            setColor2(e.target.value)
          }
          className="h-16 w-full rounded-2xl border border-black/10 bg-white"
        />

        <input
          type="number"
          value={direction}
          onChange={(e) =>
            setDirection(e.target.value)
          }
          placeholder="90"
          className="w-full rounded-2xl border border-black/10 px-4 py-4 bg-white"
        />
      </div>

      <div
        className="h-64 rounded-[2rem] border border-black/10"
        style={{
          background: gradient,
        }}
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          CSS Code
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm">
{`background: ${gradient};`}
        </pre>
      </div>
    </div>
  );
}