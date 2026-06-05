"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";

function calculateStrength(password: string) {
  let score = 0;

  if (password.length >= 12) score += 25;
  if (password.length >= 16) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  const finalScore = Math.min(score, 100);

  if (finalScore >= 80) return { label: "Strong", score: finalScore };
  if (finalScore >= 55) return { label: "Good", score: finalScore };
  if (finalScore >= 35) return { label: "Medium", score: finalScore };

  return { label: "Weak", score: finalScore };
}

function generatePassword(options: {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}) {
  let pool = "";
  let required = "";

  if (options.lowercase) {
    pool += LOWERCASE;
    required += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  }

  if (options.uppercase) {
    pool += UPPERCASE;
    required += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  }

  if (options.numbers) {
    pool += NUMBERS;
    required += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  }

  if (options.symbols) {
    pool += SYMBOLS;
    required += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  if (options.excludeSimilar) {
    pool = pool.replace(/[Il1O0]/g, "");
    required = required.replace(/[Il1O0]/g, "");
  }

  if (!pool) return "";

  const remainingLength = Math.max(options.length - required.length, 0);

  const randomPart = Array.from({ length: remainingLength }, () => {
    return pool[Math.floor(Math.random() * pool.length)];
  }).join("");

  return [...required, ...randomPart]
    .sort(() => Math.random() - 0.5)
    .join("");
}

export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(18);
  const [count, setCount] = useState(5);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const passwords = useMemo(() => {
    if (
      length < 4 ||
      length > 128 ||
      count < 1 ||
      count > 100 ||
      (!lowercase && !uppercase && !numbers && !symbols)
    ) {
      return [];
    }

    return Array.from({ length: count }, () =>
      generatePassword({
        length,
        lowercase,
        uppercase,
        numbers,
        symbols,
        excludeSimilar,
      })
    );
  }, [
    length,
    count,
    lowercase,
    uppercase,
    numbers,
    symbols,
    excludeSimilar,
    refreshKey,
  ]);

  const mainPassword = passwords[0] || "";
  const strength = calculateStrength(mainPassword);

  function validateInputs() {
    if (length < 4 || length > 128) {
      setError("Password length must be between 4 and 128 characters.");
      return false;
    }

    if (count < 1 || count > 100) {
      setError("Password count must be between 1 and 100.");
      return false;
    }

    if (!lowercase && !uppercase && !numbers && !symbols) {
      setError("Select at least one character type.");
      return false;
    }

    setError("");
    return true;
  }

  function regenerate() {
    if (validateInputs()) {
      setRefreshKey((value) => value + 1);
    }
  }

  async function copyPassword(password: string) {
    await navigator.clipboard.writeText(password);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(passwords.join("\n"));
  }

  function downloadPasswords() {
    const blob = new Blob([passwords.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "generated-passwords.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setLength(18);
    setCount(5);
    setLowercase(true);
    setUppercase(true);
    setNumbers(true);
    setSymbols(true);
    setExcludeSimilar(true);
    setRefreshKey((value) => value + 1);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate secure passwords
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create strong random passwords with custom length, character types,
          similar-character filtering and bulk generation.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Password length"
            value={length}
            min={4}
            max={128}
            onChange={setLength}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Number of passwords"
            value={count}
            min={1}
            max={100}
            onChange={setCount}
            onBlur={validateInputs}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Lowercase letters" checked={lowercase} onChange={setLowercase} />
          <Toggle label="Uppercase letters" checked={uppercase} onChange={setUppercase} />
          <Toggle label="Numbers" checked={numbers} onChange={setNumbers} />
          <Toggle label="Symbols" checked={symbols} onChange={setSymbols} />
          <Toggle label="Exclude similar characters" checked={excludeSimilar} onChange={setExcludeSimilar} />
        </div>

        {error && <ToolErrorBox message={error} />}
      </div>

      {passwords.length > 0 ? (
        <ToolResultBox title="Generated passwords">
          <div className="grid gap-3">
            {passwords.map((password, index) => (
              <div
                key={`${password}-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <code className="break-all font-mono text-sm font-bold text-black">
                  {password}
                </code>

                <button
                  type="button"
                  onClick={() => copyPassword(password)}
                  className="rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black transition hover:bg-black/5"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ResultCard label="Strength" value={strength.label} highlight />
            <ResultCard label="Strength score" value={`${strength.score}/100`} />
            <ResultCard label="Password length" value={length.toString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Select valid password settings to generate secure passwords.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={regenerate}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Generate new passwords
        </button>

        <button
          type="button"
          onClick={copyAll}
          disabled={!passwords.length}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
        >
          Copy all
        </button>

        <button
          type="button"
          onClick={downloadPasswords}
          disabled={!passwords.length}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
        >
          Download
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Use unique passwords for every account. A longer password with mixed
        character types is generally stronger than a short complex password.
        This tool runs locally in the browser.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
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

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}