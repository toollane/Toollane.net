"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function parseCsvLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === delimiter && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);

  return values;
}

function escapeCsv(value: string, delimiter: string) {
  if (value.includes('"') || value.includes("\n") || value.includes(delimiter)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export default function CsvCleanerClient() {
  const [csv, setCsv] = useState(` name , email , plan 
 Alice , alice@example.com , Pro 
 Bob , bob@example.com , Free 
 Alice , alice@example.com , Pro `);
  const [delimiter, setDelimiter] = useState(",");
  const [trimCells, setTrimCells] = useState(true);
  const [removeEmptyRows, setRemoveEmptyRows] = useState(true);
  const [removeDuplicateRows, setRemoveDuplicateRows] = useState(true);
  const [normalizeHeaders, setNormalizeHeaders] = useState(true);

  const result = useMemo(() => {
    let rows = csv
      .split(/\r?\n/)
      .map((line) => parseCsvLine(line, delimiter));

    const originalRows = rows.length;

    if (trimCells) {
      rows = rows.map((row) => row.map((cell) => cell.trim()));
    }

    if (removeEmptyRows) {
      rows = rows.filter((row) => row.some((cell) => cell.trim()));
    }

    if (normalizeHeaders && rows.length) {
      rows[0] = rows[0].map((header) =>
        header
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "")
      );
    }

    if (removeDuplicateRows) {
      const seen = new Set<string>();

      rows = rows.filter((row, index) => {
        if (index === 0) return true;

        const key = JSON.stringify(row);

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
    }

    const cleaned = rows
      .map((row) => row.map((cell) => escapeCsv(cell, delimiter)).join(delimiter))
      .join("\n");

    return {
      cleaned,
      originalRows,
      finalRows: rows.length,
      removedRows: originalRows - rows.length,
      columns: rows[0]?.length || 0,
      characters: cleaned.length,
    };
  }, [
    csv,
    delimiter,
    trimCells,
    removeEmptyRows,
    removeDuplicateRows,
    normalizeHeaders,
  ]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.cleaned);
  }

  function downloadCsv() {
    const blob = new Blob([result.cleaned], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cleaned.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setCsv(` name , email , plan 
 Alice , alice@example.com , Pro 
 Bob , bob@example.com , Free 
 Alice , alice@example.com , Pro `);
    setDelimiter(",");
    setTrimCells(true);
    setRemoveEmptyRows(true);
    setRemoveDuplicateRows(true);
    setNormalizeHeaders(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Clean CSV data
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Clean CSV files by trimming cells, removing empty rows, removing
          duplicate rows and normalizing headers.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Delimiter</span>

        <input
          value={delimiter}
          maxLength={1}
          onChange={(event) => setDelimiter(event.target.value || ",")}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle label="Trim cells" checked={trimCells} onChange={setTrimCells} />
        <Toggle label="Remove empty rows" checked={removeEmptyRows} onChange={setRemoveEmptyRows} />
        <Toggle label="Remove duplicate rows" checked={removeDuplicateRows} onChange={setRemoveDuplicateRows} />
        <Toggle label="Normalize headers" checked={normalizeHeaders} onChange={setNormalizeHeaders} />
      </div>

      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste CSV here..."
      />

      <ToolResultBox title="Cleaned CSV">
        <textarea
          readOnly
          value={result.cleaned}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Original rows" value={result.originalRows.toLocaleString()} />
          <ResultCard label="Final rows" value={result.finalRows.toLocaleString()} />
          <ResultCard label="Rows removed" value={result.removedRows.toLocaleString()} />
          <ResultCard label="Columns" value={result.columns.toLocaleString()} />
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy cleaned CSV
        </button>

        <button type="button" onClick={downloadCsv} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Download CSV
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        CSV cleanup is useful before importing data into spreadsheets, CRMs,
        databases, analytics tools or ecommerce systems.
      </ToolInfoBox>
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