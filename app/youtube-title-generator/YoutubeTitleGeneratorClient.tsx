"use client";

import { useMemo, useState } from "react";

import ToolResultBox from "@/components/ToolResultBox";

const TEMPLATES = [
  "How to {topic}",
  "{topic} Explained",
  "Best {topic} Tips",
  "{topic} Tutorial for Beginners",
  "Top 10 {topic} Strategies",
  "The Ultimate {topic} Guide",
  "I Tried {topic} for 30 Days",
  "Avoid These {topic} Mistakes",
  "{topic} Secrets Nobody Tells You",
];

export default function YoutubeTitleGeneratorClient() {
  const [topic, setTopic] = useState(
    "SEO optimization"
  );

  const titles = useMemo(() => {
    return TEMPLATES.map((template) =>
      template.replace(/\{topic\}/g, topic)
    );
  }, [topic]);

  async function copyAll() {
    await navigator.clipboard.writeText(
      titles.join("\n")
    );
  }

  function resetExample() {
    setTopic("SEO optimization");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate YouTube video titles
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Generate engaging YouTube titles for tutorials, reviews, educational
          content and creator channels.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          Video topic
        </span>

        <input
          value={topic}
          onChange={(event) =>
            setTopic(event.target.value)
          }
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />
      </label>

      <ToolResultBox title="Generated YouTube titles">
        <div className="grid gap-3">
          {titles.map((title) => (
            <div
              key={title}
              className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-bold text-black"
            >
              {title}
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
          Copy titles
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