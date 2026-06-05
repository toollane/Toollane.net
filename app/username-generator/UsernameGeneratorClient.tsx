"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

export default function UsernameGeneratorClient() {
  const [keyword, setKeyword] = useState("alex");
  const [includeNumbers, setIncludeNumbers] =
    useState(true);

  const usernames = useMemo(() => {
    const base = keyword
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const generated = new Set<string>();

    const prefixes = [
      "real",
      "official",
      "the",
      "its",
      "hey",
      "mr",
    ];

    const suffixes = [
      "tv",
      "hq",
      "live",
      "online",
      "media",
      "world",
    ];

    prefixes.forEach((prefix) => {
      generated.add(`${prefix}${base}`);
    });

    suffixes.forEach((suffix) => {
      generated.add(`${base}${suffix}`);
    });

    generated.add(`${base}_official`);
    generated.add(`${base}.media`);

    if (includeNumbers) {
      generated.add(`${base}24`);
      generated.add(`${base}365`);
      generated.add(`${base}2026`);
    }

    return Array.from(generated).slice(0, 30);
  }, [keyword, includeNumbers]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      usernames.join("\n")
    );
  }

  function resetExample() {
    setKeyword("alex");
    setIncludeNumbers(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate usernames
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate usernames for Instagram, TikTok, YouTube, X, gaming and
          online profiles.
        </p>
      </div>

      <Input
        label="Name or keyword"
        value={keyword}
        onChange={setKeyword}
      />

      <label className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
        <span className="text-sm font-bold text-black">
          Include numbers
        </span>

        <input
          type="checkbox"
          checked={includeNumbers}
          onChange={(event) =>
            setIncludeNumbers(event.target.checked)
          }
          className="h-5 w-5 accent-black"
        />
      </label>

      <ToolResultBox title="Generated usernames">
        <div className="grid gap-3">
          {usernames.map((username) => (
            <div
              key={username}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 font-mono text-black"
            >
              @{username}
            </div>
          ))}
        </div>
      </ToolResultBox>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyAll}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy usernames
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}