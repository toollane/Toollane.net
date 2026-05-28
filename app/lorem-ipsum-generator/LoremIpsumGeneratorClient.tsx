"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default function LoremIpsumGeneratorClient() {
  const [paragraphs, setParagraphs] = useState("3");
  const [htmlMode, setHtmlMode] = useState(false);

  const result = useMemo(() => {
    const count = parseInt(paragraphs, 10);

    if (isNaN(count) || count <= 0) {
      return "";
    }

    const items = Array.from({ length: count }, () => lorem);

    if (htmlMode) {
      return items.map((item) => `<p>${item}</p>`).join("\n");
    }

    return items.join("\n\n");
  }, [paragraphs, htmlMode]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Generate Lorem Ipsum Text
        </h2>

        <p className="text-black/60 leading-7">
          Generate dummy text for layouts, designs, websites and content drafts.
        </p>
      </div>

      <NumberInput
        label="Number of Paragraphs"
        value={paragraphs}
        onChange={setParagraphs}
        placeholder="3"
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={htmlMode}
          onChange={(e) => setHtmlMode(e.target.checked)}
        />
        Generate HTML paragraph tags
      </label>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Generated Text
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}