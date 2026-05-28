"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function TextRepeaterClient() {
  const [text, setText] = useState("");
  const [times, setTimes] = useState("3");

  const result = useMemo(() => {
    const repeatCount = parseInt(times, 10);

    if (!text || isNaN(repeatCount) || repeatCount <= 0) {
      return "";
    }

    return Array.from({ length: repeatCount }, () => text).join("\n");
  }, [text, times]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Repeat Text</h2>

        <p className="text-black/60 leading-7">
          Repeat any text multiple times instantly for messages, testing, formatting and content tasks.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to repeat..."
        rows={5}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <NumberInput
        label="Repeat Count"
        value={times}
        onChange={setTimes}
        placeholder="3"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Repeated Text</div>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}