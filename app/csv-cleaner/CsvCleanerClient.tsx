"use client";

import { useMemo, useState } from "react";

export default function CsvCleanerClient() {
  const [csv, setCsv] = useState("");
  const [delimiter, setDelimiter] = useState(",");

  const result = useMemo(() => {
    if (!csv.trim()) return "";

    return csv
      .split(/\r?\n/)
      .map((line) =>
        line
          .split(delimiter)
          .map((cell) => cell.trim())
          .join(delimiter)
      )
      .filter((line) => line.trim())
      .join("\n");
  }, [csv, delimiter]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CSV Cleaner</h2>

        <p className="text-black/60 leading-7">
          Clean CSV data by trimming spaces, removing empty lines and keeping a consistent separator.
        </p>
      </div>

      <select
        value={delimiter}
        onChange={(event) => setDelimiter(event.target.value)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value=",">Comma separated CSV</option>
        <option value=";">Semicolon separated CSV</option>
      </select>

      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        placeholder={`name, email, city\nJohn, john@example.com, London`}
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">Clean CSV Output</div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}