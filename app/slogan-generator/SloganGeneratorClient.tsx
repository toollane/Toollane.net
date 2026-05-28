"use client";

import { useMemo, useState } from "react";

const templates = [
  "The future of {keyword}",
  "Built for better {keyword}",
  "Simple. Fast. {keyword}.",
  "Where {keyword} meets innovation",
  "Smarter {keyword} starts here",
  "Powering modern {keyword}",
  "Your daily {keyword} solution",
  "Create better {keyword}",
  "Modern tools for {keyword}",
  "Everything {keyword} in one place",
];

export default function SloganGeneratorClient() {
  const [keyword, setKeyword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const slogans = useMemo(() => {
    const value = keyword.trim() || "business";

    return Array.from({ length: 10 }, (_, index) => {
      const template =
        templates[(index + refreshKey) % templates.length];

      return template.replace("{keyword}", value);
    });
  }, [keyword, refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Slogan Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate slogan and tagline ideas instantly for startups,
          brands, creators and businesses.
        </p>
      </div>

      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Enter business or niche..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Slogans
      </button>

      <div className="grid gap-3">
        {slogans.map((slogan) => (
          <div
            key={slogan}
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 font-semibold"
          >
            {slogan}
          </div>
        ))}
      </div>
    </div>
  );
}