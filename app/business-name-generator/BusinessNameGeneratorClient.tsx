"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const PREFIXES = [
  "Nova",
  "Bright",
  "Prime",
  "Next",
  "Peak",
  "Smart",
  "Blue",
  "Cloud",
  "Urban",
  "Rapid",
];

const SUFFIXES = [
  "Labs",
  "Studio",
  "Works",
  "Hub",
  "Solutions",
  "Media",
  "Systems",
  "Digital",
  "Co",
  "Group",
];

export default function BusinessNameGeneratorClient() {
  const [keyword, setKeyword] = useState("SEO");

  const [style, setStyle] = useState("Modern");

  const names = useMemo(() => {
    const normalized = keyword.trim();

    const generated = new Set<string>();

    PREFIXES.forEach((prefix) => {
      generated.add(`${prefix} ${normalized}`);
      generated.add(`${prefix}${normalized}`);
    });

    SUFFIXES.forEach((suffix) => {
      generated.add(`${normalized} ${suffix}`);
      generated.add(`${normalized}${suffix}`);
    });

    if (style === "Minimal") {
      generated.add(`${normalized}ly`);
      generated.add(`${normalized}io`);
    }

    if (style === "Luxury") {
      generated.add(`Elite ${normalized}`);
      generated.add(`${normalized} Prestige`);
    }

    return Array.from(generated).slice(0, 30);
  }, [keyword, style]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      names.join("\n")
    );
  }

  function resetExample() {
    setKeyword("SEO");
    setStyle("Modern");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate business names
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate brandable business names for startups, agencies, ecommerce
          brands and online businesses.
        </p>
      </div>

      <div className="grid gap-4">
        <Input
          label="Business keyword"
          value={keyword}
          onChange={setKeyword}
        />

        <label className="block">
          <span className="text-sm font-bold text-black">
            Naming style
          </span>

          <select
            value={style}
            onChange={(event) =>
              setStyle(event.target.value)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option>Modern</option>
            <option>Minimal</option>
            <option>Luxury</option>
            <option>Corporate</option>
          </select>
        </label>
      </div>

      <ToolResultBox title="Generated business names">
        <div className="grid gap-3">
          {names.map((name) => (
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
          Copy names
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