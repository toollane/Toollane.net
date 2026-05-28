"use client";

import { useMemo, useState } from "react";

export default function RegexTesterClient() {
  const [pattern, setPattern] =
    useState("");

  const [text, setText] =
    useState("");

  const matches = useMemo(() => {
    if (!pattern || !text) {
      return [];
    }

    try {
      const regex = new RegExp(
        pattern,

      );

      return text.match(regex) || [];
    } catch {
      return [];
    }
  }, [pattern, text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Regex Tester
        </h2>

        <p className="text-black/60 leading-7">
          Test regular expressions
          instantly against text with
          live regex matching.
        </p>
      </div>

      <input
        value={pattern}
        onChange={(event) =>
          setPattern(
            event.target.value
          )
        }
        placeholder="Enter regex pattern..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono"
      />

      <textarea
        value={text}
        onChange={(event) =>
          setText(
            event.target.value
          )
        }
        placeholder="Enter test text..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="font-semibold mb-4">
          Matches
        </div>

        <div className="flex flex-wrap gap-3">
          {matches.length ? (
            matches.map(
              (match, index) => (
                <div
                  key={`${match}-${index}`}
                  className="bg-black text-white rounded-full px-4 py-2 text-sm"
                >
                  {match}
                </div>
              )
            )
          ) : (
            <div className="text-black/40">
              No matches found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}