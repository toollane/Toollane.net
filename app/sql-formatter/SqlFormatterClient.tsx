"use client";

import { useMemo, useState } from "react";

const keywords = [


















];

export default function SqlFormatterClient() {
  const [sql, setSql] = useState("");

  const formatted = useMemo(() => {
    if (!sql.trim()) return "";

    let output = sql.replace(/\s+/g, " ").trim();

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      output = output.replace(regex, `\n${keyword}`);
    });

    output = output
      .replace(/,/g, ",\n  ")
      .replace(/^\n/, "")
      .trim();

    return output;
  }, [sql]);

  const copySql = async () => {
    if (!formatted) return;

    await navigator.clipboard.writeText(formatted);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">SQL Formatter</h2>

        <p className="text-black/60 leading-7">
          Format SQL queries instantly to make SELECT, JOIN, WHERE and ORDER BY statements easier to read.
        </p>
      </div>

      <textarea
        value={sql}
        onChange={(event) => setSql(event.target.value)}
        placeholder="SELECT id, name, email FROM users WHERE active = 1 ORDER BY name"
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Formatted SQL</div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {formatted || "—"}
        </pre>
      </div>

      {formatted && (
        <button
          onClick={copySql}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
        >
          Copy SQL
        </button>
      )}
    </div>
  );
}