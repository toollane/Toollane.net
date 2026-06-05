"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const TEMPLATES = [
  "Powering better {keyword}.",
  "The future of {keyword}.",
  "Smarter {keyword} starts here.",
  "Built for modern {keyword}.",
  "Your partner in {keyword}.",
  "Simplifying {keyword} every day.",
  "Next-level {keyword} solutions.",
  "Grow faster with {keyword}.",
];

export default function SloganGeneratorClient() {
  const [keyword, setKeyword] = useState("marketing");

  const slogans = useMemo(() => {
    return TEMPLATES.map((template) =>
      template.replace(/\{keyword\}/g, keyword)
    );
  }, [keyword]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      slogans.join("\n")
    );
  }

  function resetExample() {
    setKeyword("marketing");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate slogans
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create catchy slogans and taglines for brands, startups, ecommerce
          stores and marketing campaigns.
        </p>
      </div>

      <Input
        label="Business keyword"
        value={keyword}
        onChange={setKeyword}
      />

      <ToolResultBox title="Generated slogans">
        <div className="grid gap-3">
          {slogans.map((slogan) => (
            <div
              key={slogan}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-black"
            >
              {slogan}
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
          Copy slogans
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