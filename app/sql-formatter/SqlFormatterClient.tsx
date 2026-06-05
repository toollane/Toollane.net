"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const exampleSql = `select users.id, users.email, count(orders.id) as orders_count from users left join orders on orders.user_id = users.id where users.created_at >= '2026-01-01' group by users.id, users.email order by orders_count desc;`;

const majorKeywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT INTO",
  "UPDATE",
  "DELETE FROM",
  "VALUES",
  "SET",
  "RETURNING",
];

const joinKeywords = [
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "FULL JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
];

function normalizeSql(input: string) {
  return input
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*;\s*/g, ";")
    .trim();
}

function uppercaseKeywords(sql: string) {
  const keywords = [
    ...majorKeywords,
    ...joinKeywords,
    "AND",
    "OR",
    "ON",
    "AS",
    "IN",
    "IS",
    "NULL",
    "NOT",
    "LIKE",
    "BETWEEN",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "DISTINCT",
    "COUNT",
    "SUM",
    "AVG",
    "MIN",
    "MAX",
  ];

  let result = sql;

  for (const keyword of keywords.sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "gi");

    result = result.replace(pattern, keyword);
  }

  return result;
}

function formatSql(input: string) {
  let sql = normalizeSql(input);
  sql = uppercaseKeywords(sql);

  const replacements: Array<[RegExp, string]> = [
    [/\bSELECT\b/g, "SELECT\n  "],
    [/\bFROM\b/g, "\nFROM"],
    [/\bWHERE\b/g, "\nWHERE"],
    [/\bGROUP BY\b/g, "\nGROUP BY"],
    [/\bHAVING\b/g, "\nHAVING"],
    [/\bORDER BY\b/g, "\nORDER BY"],
    [/\bLIMIT\b/g, "\nLIMIT"],
    [/\bOFFSET\b/g, "\nOFFSET"],
    [/\bRETURNING\b/g, "\nRETURNING"],
    [/\bVALUES\b/g, "\nVALUES"],
    [/\bSET\b/g, "\nSET"],
  ];

  for (const [pattern, replacement] of replacements) {
    sql = sql.replace(pattern, replacement);
  }

  for (const keyword of joinKeywords.sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "g");
    sql = sql.replace(pattern, `\n${keyword}`);
  }

  sql = sql.replace(/,\s*/g, ",\n  ");
  sql = sql.replace(/\bAND\b/g, "\n  AND");
  sql = sql.replace(/\bOR\b/g, "\n  OR");
  sql = sql.replace(/\s*;\s*$/g, ";");

  return sql
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function minifySql(input: string) {
  return uppercaseKeywords(normalizeSql(input));
}

function countSqlStats(sql: string) {
  const statements = sql
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean).length;

  const words = sql.split(/\s+/).filter(Boolean).length;
  const characters = sql.length;

  return {
    statements,
    words,
    characters,
  };
}

export default function SqlFormatterClient() {
  const [input, setInput] = useState(exampleSql);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const canFormat = useMemo(() => input.trim().length > 0, [input]);

  function handleFormat() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste SQL before formatting.");
      return;
    }

    setOutput(formatSql(input));
  }

  function handleMinify() {
    setError("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please paste SQL before minifying.");
      return;
    }

    setOutput(minifySql(input));
  }

  async function copyOutput() {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setCopied(false);
    setError("");
  }

  function loadExample() {
    setInput(exampleSql);
    setOutput("");
    setCopied(false);
    setError("");
  }

  const stats = output ? countSqlStats(output) : null;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Format SQL queries
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Paste SQL to format, clean up and minify queries directly in your
          browser. Useful for developers, analysts and database work.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">SQL input</span>

          <textarea
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
            }}
            spellCheck={false}
            className="mt-3 min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Paste SQL query here..."
          />
        </label>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!canFormat}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Format SQL
          </button>

          <button
            type="button"
            onClick={handleMinify}
            disabled={!canFormat}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Minify SQL
          </button>

          <button
            type="button"
            onClick={loadExample}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Load example
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Clear
          </button>
        </div>
      </div>

      {output ? (
        <ToolResultBox title="Formatted SQL">
          <div className="grid gap-5">
            {stats && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Statements
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {stats.statements}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Words
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {stats.words}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Characters
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {stats.characters}
                  </div>
                </div>
              </div>
            )}

            <pre className="max-h-[520px] overflow-auto rounded-2xl border border-black/10 bg-white p-5 text-left font-mono text-sm leading-7 text-black">
              <code>{output}</code>
            </pre>

            <button
              type="button"
              onClick={copyOutput}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Paste SQL and format it into a more readable structure. This tool is
          lightweight and runs fully in your browser.
        </ToolInfoBox>
      )}
    </div>
  );
}