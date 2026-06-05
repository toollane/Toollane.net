"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const ENDINGS = [
  "AI",
  "Flow",
  "Sync",
  "Base",
  "Cloud",
  "Forge",
  "Stack",
  "Works",
  "ly",
  "HQ",
];

export default function StartupNameGeneratorClient() {
  const [keyword, setKeyword] = useState("Growth");

  const startups = useMemo(() => {
    const normalized = keyword
      .replace(/\s+/g, "")
      .trim();

    const generated = new Set<string>();

    ENDINGS.forEach((ending) => {
      generated.add(`${normalized}${ending}`);
      generated.add(`${ending}${normalized}`);
    });

    generated.add(`${normalized}ify`);
    generated.add(`${normalized}Labs`);
    generated.add(`${normalized}Pilot`);
    generated.add(`${normalized}Nest`);

    return Array.from(generated).slice(0, 30);
  }, [keyword]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      startups.join("\n")
    );
  }

  function resetExample() {
    setKeyword("Growth");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate startup names
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate startup and SaaS brand names for technology, AI, fintech and
          online businesses.
        </p>
      </div>

      <Input
        label="Startup keyword"
        value={keyword}
        onChange={setKeyword}
      />

      <ToolResultBox title="Generated startup names">
        <div className="grid gap-3">
          {startups.map((name) => (
            <div
              key={name}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 font-bold text-black"
            >
              {name}
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
          Copy startup names
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