"use client";

import { useMemo, useState } from "react";

export default function JsonToCsvClient() {
  const [json, setJson] = useState("");
  const [delimiter, setDelimiter] = useState(",");

  const result = useMemo(() => {
    if (!json.trim()) {
      return {
        csv: "",
        error: "",
      };
    }

    try {
      const parsed = JSON.parse(json);

      const rows = Array.isArray(parsed) ? parsed : [parsed];

      if (!rows.length || typeof rows[0] !== "object") {
        return {
          csv: "",
          error: "JSON must be an object or an array of objects.",
        };
      }

      const headers = Array.from(
        new Set(
          rows.flatMap((row) =>
            Object.keys(row as Record<string, unknown>)
          )
        )
      );

      const escapeValue = (value: unknown) => {
        if (value === null || value === undefined) {
          return "";
        }

        const stringValue =
          typeof value === "object"
            ? JSON.stringify(value)
            : String(value);

        if (
          stringValue.includes(delimiter) ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      };

      const csvRows = [
        headers.join(delimiter),
        ...rows.map((row) =>
          headers
            .map((header) =>
              escapeValue(
                (row as Record<string, unknown>)[header]
              )
            )
            .join(delimiter)
        ),
      ];

      return {
        csv: csvRows.join("\n"),
        error: "",
      };
    } catch {
      return {
        csv: "",
        error: "Invalid JSON. Please check your syntax.",
      };
    }
  }, [json, delimiter]);

  const downloadCsv = () => {
    if (!result.csv) {
      return;
    }

    const blob = new Blob([result.csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted-data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          JSON to CSV Converter
        </h2>

        <p className="text-black/60 leading-7">
          Convert JSON data into CSV format instantly for spreadsheets,
          reports and data workflows.
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
        value={json}
        onChange={(event) => setJson(event.target.value)}
        placeholder={`[
  {
    "name": "John",
    "email": "john@example.com"
  },
  {
    "name": "Anna",
    "email": "anna@example.com"
  }
]`}
        rows={12}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white font-mono text-sm"
      />

      {result.error && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-black/70">
          {result.error}
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          CSV Output
        </div>

        <pre className="whitespace-pre-wrap break-words text-sm font-mono">
          {result.csv || "—"}
        </pre>
      </div>

      {result.csv && (
        <button
          onClick={downloadCsv}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
        >
          Download CSV
        </button>
      )}
    </div>
  );
}