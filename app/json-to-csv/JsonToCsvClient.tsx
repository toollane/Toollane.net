"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function flattenObject(
  value: Record<string, unknown>,
  prefix = "",
  output: Record<string, unknown> = {}
) {
  Object.entries(value).forEach(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      flattenObject(item as Record<string, unknown>, path, output);
    } else {
      output[path] = Array.isArray(item) ? item.join("; ") : item;
    }
  });

  return output;
}

function escapeCsv(value: unknown) {
  const stringValue = value === null || value === undefined ? "" : String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export default function JsonToCsvClient() {
  const [json, setJson] = useState(`[
  {
    "name": "Alice",
    "email": "alice@example.com",
    "plan": "Pro"
  },
  {
    "name": "Bob",
    "email": "bob@example.com",
    "plan": "Free"
  }
]`);

  const [flattenNested, setFlattenNested] = useState(true);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const rows = Array.isArray(parsed) ? parsed : [parsed];

      const normalizedRows = rows.map((row) =>
        flattenNested && row && typeof row === "object" && !Array.isArray(row)
          ? flattenObject(row as Record<string, unknown>)
          : row
      ) as Record<string, unknown>[];

      const headers = Array.from(
        new Set(
          normalizedRows.flatMap((row) =>
            row && typeof row === "object" ? Object.keys(row) : []
          )
        )
      );

      const csvRows = [
        headers.map(escapeCsv).join(","),
        ...normalizedRows.map((row) =>
          headers.map((header) => escapeCsv(row[header])).join(",")
        ),
      ];

      const csv = csvRows.join("\n");

      return {
        valid: true,
        csv,
        error: "",
        rows: normalizedRows.length,
        columns: headers.length,
        characters: csv.length,
      };
    } catch (error) {
      return {
        valid: false,
        csv: "",
        error: error instanceof Error ? error.message : "Invalid JSON.",
        rows: 0,
        columns: 0,
        characters: 0,
      };
    }
  }, [json, flattenNested]);

  async function copyResult() {
    if (result.valid) {
      await navigator.clipboard.writeText(result.csv);
    }
  }

  function downloadCsv() {
    if (!result.valid) return;

    const blob = new Blob([result.csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setJson(`[
  {
    "name": "Alice",
    "email": "alice@example.com",
    "plan": "Pro"
  },
  {
    "name": "Bob",
    "email": "bob@example.com",
    "plan": "Free"
  }
]`);
    setFlattenNested(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert JSON to CSV
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert JSON arrays or objects into CSV with optional nested object
          flattening.
        </p>
      </div>

      <Toggle
        label="Flatten nested objects"
        checked={flattenNested}
        onChange={setFlattenNested}
      />

      <textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste JSON here..."
      />

      {!result.valid && <ToolErrorBox message={result.error} />}

      {result.valid ? (
        <ToolResultBox title="CSV output">
          <textarea
            readOnly
            value={result.csv}
            className="min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ResultCard label="Rows" value={result.rows.toLocaleString()} />
            <ResultCard label="Columns" value={result.columns.toLocaleString()} />
            <ResultCard label="Characters" value={result.characters.toLocaleString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid JSON to convert it into CSV.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} disabled={!result.valid} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
          Copy CSV
        </button>

        <button type="button" onClick={downloadCsv} disabled={!result.valid} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50">
          Download CSV
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}