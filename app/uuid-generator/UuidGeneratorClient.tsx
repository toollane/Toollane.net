"use client";

import { useMemo, useState } from "react";

export default function UuidGeneratorClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  const uuid = useMemo(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
    });
  }, [refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Generate UUID
        </h2>

        <p className="text-black/60 leading-7">
          Generate a random UUID instantly for development, testing, databases and APIs.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white px-5 py-4 rounded-2xl font-semibold"
      >
        Generate New UUID
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          UUID
        </div>

        <div className="break-all text-2xl font-bold">
          {uuid}
        </div>
      </div>
    </div>
  );
}