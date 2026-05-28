"use client";

import { useMemo, useState } from "react";

export default function CharacterCounterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Count Characters
        </h2>

        <p className="text-black/60 leading-7">
          Paste text to count characters, characters without spaces and lines instantly.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Characters</div>
          <div className="text-3xl font-bold">{result.characters}</div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">No Spaces</div>
          <div className="text-3xl font-bold">
            {result.charactersNoSpaces}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Lines</div>
          <div className="text-3xl font-bold">{result.lines}</div>
        </div>
      </div>
    </div>
  );
}