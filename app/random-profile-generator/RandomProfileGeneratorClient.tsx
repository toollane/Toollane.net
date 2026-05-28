"use client";

import { useMemo, useState } from "react";

const firstNames = [










];

const lastNames = [










];

const countries = [










];

const jobs = [










];

export default function RandomProfileGeneratorClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  const profile = useMemo(() => {
    const first = firstNames[refreshKey % firstNames.length];
    const last = lastNames[(refreshKey * 2) % lastNames.length];

    return {
      name: `${first} ${last}`,
      country: countries[(refreshKey * 3) % countries.length],
      job: jobs[(refreshKey * 4) % jobs.length],
      username: `${first.toLowerCase()}${last.toLowerCase()}${1000 + refreshKey}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    };
  }, [refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Random Profile Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate random sample profiles for mockups, test data, writing and creative projects.
        </p>
      </div>

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Profile
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-6 grid gap-4">
        {Object.entries(profile).map(([label, value]) => (
          <div key={label}>
            <div className="text-sm text-black/50 capitalize">
              {label}
            </div>

            <div className="text-xl font-bold break-words">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}