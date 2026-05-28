"use client";

import { useMemo, useState } from "react";

export default function SlugGeneratorClient() {
  const [text, setText] = useState("");

  const slug = useMemo(() => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Generate SEO Slugs
        </h2>

        <p className="text-black/60 leading-7">
          Convert titles and text into SEO-friendly URL slugs instantly.
        </p>
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Enter title or text..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Generated Slug
        </div>

        <div className="break-all text-2xl font-bold">
          {slug || "—"}
        </div>
      </div>
    </div>
  );
}