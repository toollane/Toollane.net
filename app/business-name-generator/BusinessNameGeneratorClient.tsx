"use client";

import { useMemo, useState } from "react";

const prefixes = [










];

const suffixes = [










];

export default function BusinessNameGeneratorClient() {
  const [keyword, setKeyword] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const names = useMemo(() => {
    const base =
      keyword
        .trim()
        .replace(/\s+/g, "") || "Brand";

    return Array.from(
      { length: 12 },
      (_, index) => {
        const prefix =
          prefixes[
            (index + refreshKey) %
              prefixes.length
          ];

        const suffix =
          suffixes[
            (index * 2 +
              refreshKey) %
              suffixes.length
          ];

        return `${prefix}${base}${suffix}`;
      }
    );
  }, [keyword, refreshKey]);

  const copyName = async (
    name: string
  ) => {
    await navigator.clipboard.writeText(
      name
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Business Name Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate business and
          startup name ideas instantly
          for brands, companies and
          online projects.
        </p>
      </div>

      <input
        value={keyword}
        onChange={(event) =>
          setKeyword(event.target.value)
        }
        placeholder="Enter keyword or niche..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={() =>
          setRefreshKey(
            (value) => value + 1
          )
        }
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Business Names
      </button>

      <div className="grid gap-3">
        {names.map((name) => (
          <button
            key={name}
            onClick={() =>
              copyName(name)
            }
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 text-left font-semibold hover:border-black transition"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}