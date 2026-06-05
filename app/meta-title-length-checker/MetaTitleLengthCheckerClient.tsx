"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

export default function MetaTitleLengthCheckerClient() {
  const [title, setTitle] = useState(
    "Best SEO Meta Title Length Checker for Websites"
  );

  const result = useMemo(() => {
    const length = title.length;

    let status = "Good";
    let color = "text-green-600";

    if (length < 30) {
      status = "Too short";
      color = "text-yellow-600";
    }

    if (length > 60) {
      status = "Too long";
      color = "text-red-600";
    }

    return {
      length,
      status,
      color,
      pixels: length * 9,
    };
  }, [title]);

  async function copyResult() {
    await navigator.clipboard.writeText(title);
  }

  function resetExample() {
    setTitle(
      "Best SEO Meta Title Length Checker for Websites"
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Check meta title length
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Analyze SEO title length for search engines and optimize your SERP
          visibility.
        </p>
      </div>

      <textarea
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none transition focus:border-black"
      />

      <ToolResultBox title="SEO title analysis">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard
            label="Characters"
            value={result.length.toString()}
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
            {title || "Your page title"}
          </div>

          <div className="mt-2 text-sm text-[#006621]">
            https://example.com
          </div>

          <div className="mt-2 text-sm text-black/60">
            Example meta description preview for search engine results pages.
          </div>
        </div>
      </ToolResultBox>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy title
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