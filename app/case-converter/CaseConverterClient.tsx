"use client";

import { useMemo, useState } from "react";

export default function CaseConverterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    return {
      uppercase:
        text.toUpperCase(),

      lowercase:
        text.toLowerCase(),

      titlecase: text.replace(
        /\w\S*/g,
        (word) =>
          word.charAt(0).toUpperCase() +
          word
            .slice(1)
            .toLowerCase()
      ),
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Convert Text Case
        </h2>

        <p className="text-black/60 leading-7">
          Convert text to uppercase, lowercase and title case instantly.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Paste your text here..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid gap-4">
        {[
          [

            result.uppercase,
          ],
          [

            result.lowercase,
          ],
          [

            result.titlecase,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-black/10 rounded-3xl p-6"
          >
            <div className="text-sm text-black/50 mb-2">
              {label}
            </div>

            <div className="break-words text-lg font-semibold">
              {value || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}