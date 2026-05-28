"use client";

import { useMemo, useState } from "react";

const maleNames = [










];

const femaleNames = [










];

const lastNames = [










];

export default function RandomNameGeneratorClient() {
  const [type, setType] = useState("mixed");
  const [refreshKey, setRefreshKey] = useState(0);

  const names = useMemo(() => {
    const firstNames =
      type === "male"
        ? maleNames
        : type === "female"
          ? femaleNames
          : [...maleNames, ...femaleNames];

    return Array.from({ length: 10 }, (_, index) => {
      const first =
        firstNames[(index + refreshKey) % firstNames.length];

      const last =
        lastNames[(index * 2 + refreshKey) % lastNames.length];

      return `${first} ${last}`;
    });
  }, [type, refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Random Name Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate random male, female or mixed full names for writing, testing, games and creative projects.
        </p>
      </div>

      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="mixed">Mixed Names</option>
        <option value="male">Male Names</option>
        <option value="female">Female Names</option>
      </select>

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Names
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