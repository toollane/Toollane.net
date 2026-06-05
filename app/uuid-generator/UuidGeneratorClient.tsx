"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function generateUuid() {
  return crypto.randomUUID();
}

export default function UuidGeneratorClient() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const uuids = useMemo(() => {
    return Array.from({ length: count }, () => {
      let uuid = generateUuid();

      if (removeHyphens) {
        uuid = uuid.replace(/-/g, "");
      }

      if (uppercase) {
        uuid = uuid.toUpperCase();
      }

      return uuid;
    });
  }, [count, uppercase, removeHyphens, refreshKey]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      uuids.join("\n")
    );
  }

  function regenerate() {
    setRefreshKey((value) => value + 1);
  }

  function resetExample() {
    setCount(5);
    setUppercase(false);
    setRemoveHyphens(false);
    setRefreshKey((value) => value + 1);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate UUIDs online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate random UUID v4 identifiers for databases, APIs, systems,
          sessions and development workflows.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Number of UUIDs
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

        <Toggle
          label="Uppercase"
          checked={uppercase}
          onChange={setUppercase}
        />

        <Toggle
          label="Remove hyphens"
          checked={removeHyphens}
          onChange={setRemoveHyphens}
        />
      </div>

      <ToolResultBox title="Generated UUIDs">
        <div className="grid gap-3">
          {uuids.map((uuid) => (
            <div
              key={uuid}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 font-mono text-sm text-black break-all"
            >
              {uuid}
            </div>
          ))}
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyAll}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy all UUIDs
        </button>

        <button
          type="button"
          onClick={regenerate}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Generate new UUIDs
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        UUID v4 values are randomly generated and commonly used for unique IDs
        across distributed systems.
      </ToolInfoBox>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 accent-black"
      />
    </label>
  );
}