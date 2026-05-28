"use client";

import { useMemo, useState } from "react";

const techPrefixes = [










];

const techSuffixes = [










];

export default function StartupNameGeneratorClient() {
  const [keyword, setKeyword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const names = useMemo(() => {
    const value =
      keyword.trim().replace(/\s+/g, "") || "Start";

    return Array.from({ length: 12 }, (_, index) => {
      const prefix =
        techPrefixes[(index + refreshKey) % techPrefixes.length];

      const suffix =
        techSuffixes[(index * 2 + refreshKey) % techSuffixes.length];

      return `${prefix}${value}${suffix}`;
    });
  }, [keyword, refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Startup Name Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate startup and tech company name ideas instantly for SaaS,
          AI, apps and digital brands.
        </p>
      </div>

      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Enter startup niche..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Startup Names
      </button>

      <div className="grid gap-3">
        {names.map((name) => (
          <div
            key={name}
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 font-semibold"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}