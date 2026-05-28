"use client";

import { useMemo, useState } from "react";

export default function TextDiffCheckerClient() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const result = useMemo(() => {
    const leftLines = leftText.split(/\r?\n/);
    const rightLines = rightText.split(/\r?\n/);

    const maxLength = Math.max(leftLines.length, rightLines.length);

    return Array.from({ length: maxLength }, (_, index) => {
      const left = leftLines[index] || "";
      const right = rightLines[index] || "";

      return {
        line: index + 1,
        left,
        right,
        same: left === right,
      };
    });
  }, [leftText, rightText]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Text Diff Checker</h2>

        <p className="text-black/60 leading-7">
          Compare two texts line by line and quickly find differences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          value={leftText}
          onChange={(event) => setLeftText(event.target.value)}
          placeholder="First text..."
          rows={10}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
        />

        <textarea
          value={rightText}
          onChange={(event) => setRightText(event.target.value)}
          placeholder="Second text..."
          rows={10}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
        />
      </div>

      <div className="grid gap-3">
        {result.map((item) => (
          <div
            key={item.line}
            className={`grid md:grid-cols-[80px_1fr_1fr] gap-3 rounded-2xl border p-4 ${
              item.same
                ? "bg-white border-black/10"
                : "bg-black text-white border-black"
            }`}
          >
            <div className="font-semibold">Line {item.line}</div>
            <div className="break-words">{item.left || "—"}</div>
            <div className="break-words">{item.right || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}