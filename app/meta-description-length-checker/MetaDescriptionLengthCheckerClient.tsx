"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

export default function MetaDescriptionLengthCheckerClient() {
  const [description, setDescription] = useState(
    "Analyze your SEO meta description length and optimize your search engine click-through rate with this free online tool."
  );

  const result = useMemo(() => {
    const characters = description.length;
    const words =
      description.match(/\b[\w'-]+\b/g)?.length || 0;

    let status = "Good";
    let color = "text-green-600";

    if (characters < 70) {
      status = "Too short";
      color = "text-yellow-600";
    }

    if (characters > 160) {
      status = "Too long";
      color = "text-red-600";
    }

    return {
      characters,
      words,
      status,
      color,
      pixels: characters * 7,
    };
  }, [description]);

  async function copyText() {
    await navigator.clipboard.writeText(description);
  }

  function resetExample() {
    setDescription(
      "Analyze your SEO meta description length and optimize your search engine click-through rate with this free online tool."
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Check meta description length
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Optimize SEO meta descriptions for Google search results and improve
          click-through rates.
        </p>
      </div>

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        className="min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Enter your meta description..."
      />

      <ToolResultBox title="SEO analysis">
        <div className="grid gap-4 sm:grid-cols-4">
          <ResultCard
            label="Characters"
            value={result.characters.toString()}
          />

          <ResultCard
            label="Words"
            value={result.words.toString()}
          />

          <ResultCard
            label="Estimated pixels"
            value={result.pixels.toString()}
          />

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-black/40">
              Status
            </div>

            <div
              className={`mt-2 text-xl font-black ${result.color}`}
            >
              {result.status}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-black/40">
            Google SERP preview
          </div>

          <div className="mt-3 text-xl text-[#1a0dab]">
            Example Page Title
          </div>

          <div className="mt-1 text-sm text-[#006621]">
            https://example.com
          </div>

          <div className="mt-2 text-sm leading-6 text-black/70">
            {description ||
              "Your meta description preview will appear here."}
          </div>
        </div>
      </ToolResultBox>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyText}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy description
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

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">
        {value}
      </div>
    </div>
  );
}