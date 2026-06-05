"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const FIRST_NAMES = [
  "Alex",
  "Emma",
  "Liam",
  "Sophia",
  "Noah",
  "Mia",
  "Lucas",
  "Olivia",
  "Ethan",
  "Ava",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Brown",
  "Taylor",
  "Miller",
  "Wilson",
  "Moore",
  "Clark",
  "Lewis",
  "Walker",
];

export default function RandomNameGeneratorClient() {
  const [count, setCount] = useState(10);

  const names = useMemo(() => {
    return Array.from({ length: count }, () => {
      const first =
        FIRST_NAMES[
          Math.floor(Math.random() * FIRST_NAMES.length)
        ];

      const last =
        LAST_NAMES[
          Math.floor(Math.random() * LAST_NAMES.length)
        ];

      return `${first} ${last}`;
    });
  }, [count]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      names.join("\n")
    );
  }

  function regenerate() {
    setCount((value) => value);
  }

  function resetExample() {
    setCount(10);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate random names
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate random names for testing, placeholders, games, apps and user
          profile mockups.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          Number of names
        </span>

        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(event) =>
            setCount(Number(event.target.value))
          }
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />
      </label>

      <ToolResultBox title="Generated names">
        <div className="grid gap-3">
          {names.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-black"
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