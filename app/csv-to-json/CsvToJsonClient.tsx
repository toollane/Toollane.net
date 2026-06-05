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

function parseCsv(csv: string, delimiter: string) {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  const headers = parseCsvLine(lines[0], delimiter);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line, delimiter);

    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}

export default function CsvToJsonClient() {
  const [csv, setCsv] = useState(`name,email,plan
Alice,alice@example.com,Pro
Bob,bob@example.com,Free`);
  const [delimiter, setDelimiter] = useState(",");
  const [prettyPrint, setPrettyPrint] = useState(true);

  const result = useMemo(() => {
    const rows = parseCsv(csv, delimiter);
    const json = JSON.stringify(rows, null, prettyPrint ? 2 : 0);

    return {
      json,
      rows: rows.length,
      columns: rows[0] ? Object.keys(rows[0]).length : 0,
      characters: json.length,
    };
  }, [csv, delimiter, prettyPrint]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.json);
  }

  function downloadJson() {
    const blob = new Blob([result.json], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "converted.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setCsv(`name,email,plan
Alice,alice@example.com,Pro
Bob,bob@example.com,Free`);
    setDelimiter(",");
    setPrettyPrint(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert CSV to JSON
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert CSV data into JSON arrays using the first row as field names.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">Delimiter</span>

          <input
            value={delimiter}
            maxLength={1}
            onChange={(event) => setDelimiter(event.target.value || ",")}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <Toggle
          label="Pretty print JSON"
          checked={prettyPrint}
          onChange={setPrettyPrint}
        />
      </div>

      <textarea
        value={csv}
        onChange={(event) => setCsv(event.target.value)}
        className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste CSV here..."
      />

      <ToolResultBox title="JSON output">
        <textarea
          readOnly
          value={result.json}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ResultCard label="Rows" value={result.rows.toLocaleString()} />
          <ResultCard label="Columns" value={result.columns.toLocaleString()} />
          <ResultCard label="Characters" value={result.characters.toLocaleString()} />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={copyResult} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Copy JSON
        </button>

        <button type="button" onClick={downloadJson} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Download JSON
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        This converter supports standard quoted CSV values and custom
        single-character delimiters.
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