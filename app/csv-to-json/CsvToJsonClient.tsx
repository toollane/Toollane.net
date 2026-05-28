"use client";

import { useMemo, useState } from "react";

export default function CsvToJsonClient() {
  const [csv, setCsv] = useState("");
  const [delimiter, setDelimiter] = useState(",");

  const result = useMemo(() => {
    if (!csv.trim()) return "";

    const lines = csv.trim().split(/\r?\n/);
    const headers = lines[0].split(delimiter).map((item) => item.trim());

    const rows = lines.slice(1).map((line) => {
      const values = line.split(delimiter).map((item) => item.trim());

      return headers.reduce((acc, header, index) => {
        acc[header] = values[index] || "";
        return acc;
      }, {} as Record<string, string>);
    });

    return JSON.stringify(rows, null, 2);
  }, [csv, delimiter]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">CSV to JSON Converter</h2>

        <p className="text-black/60 leading-7">
          Convert CSV data into readable JSON instantly. Choose comma or semicolon as separator.
        </p>
      </div>

      <select
        value={delimiter}
        onChange={(e) => setDelimiter(e.target.value)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value=",">Comma separated CSV</option>
        <option value=";">Semicolon separated CSV</option>
      </select>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder={`name,email\nJohn,john@example.com\nAnna,anna@example.com`}
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">JSON Output</div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {result || "—"}
        </pre>
      </div>
    </div>
  );
}