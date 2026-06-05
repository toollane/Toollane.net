"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const TONES = [
  "Professional",
  "Friendly",
  "Minimal",
  "Creative",
  "Luxury",
];

export default function SocialBioGeneratorClient() {
  const [name, setName] = useState("Alex");
  const [profession, setProfession] =
    useState("SEO Consultant");

  const [tone, setTone] = useState("Professional");

  const bios = useMemo(() => {
    const generated = [
      `${profession} helping brands grow online 🚀`,
      `Building better visibility through ${profession.toLowerCase()} strategies.`,
      `Helping businesses scale with smart digital growth.`,
      `${profession} | Content | Strategy | Growth`,
      `Turning ideas into online growth.`,
    ];

    if (tone === "Creative") {
      generated.push(
        `Obsessed with growth, content and creative strategy ✨`
      );
    }

    if (tone === "Luxury") {
      generated.push(
        `Premium ${profession.toLowerCase()} services for ambitious brands.`
      );
    }

    return generated.map(
      (bio) => `${name} • ${bio}`
    );
  }, [name, profession, tone]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      bios.join("\n")
    );
  }

  function resetExample() {
    setName("Alex");
    setProfession("SEO Consultant");
    setTone("Professional");
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate social media bios
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create bios for Instagram, TikTok, X, LinkedIn and creator profiles.
        </p>
      </div>

      <div className="grid gap-4">
        <Input
          label="Name or brand"
          value={name}
          onChange={setName}
        />

        <Input
          label="Profession or niche"
          value={profession}
          onChange={setProfession}
        />

        <label className="block">
          <span className="text-sm font-bold text-black">
            Tone
          </span>

          <select
            value={tone}
            onChange={(event) =>
              setTone(event.target.value)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            {TONES.map((toneOption) => (
              <option
                key={toneOption}
                value={toneOption}
              >
                {toneOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ToolResultBox title="Generated bios">
        <div className="grid gap-3">
          {bios.map((bio) => (
            <div
              key={bio}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black"
            >
              {bio}
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
          Copy bios
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