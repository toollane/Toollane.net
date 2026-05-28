"use client";

import { useMemo, useState } from "react";

export default function YoutubeTitleGeneratorClient() {
  const [topic, setTopic] = useState("");

  const titles = useMemo(() => {
    if (!topic.trim()) {
      return [];
    }

    return [
      `10 ${topic} Tips You Need to Know`,
      `How to Master ${topic} in 2026`,
      `The Ultimate ${topic} Guide`,
      `${topic}: Beginner Mistakes to Avoid`,
      `I Tried ${topic} for 30 Days`,
      `Best ${topic} Strategies That Work`,
      `Everything You Need to Know About ${topic}`,
      `How ${topic} Changed My Results`,
      `Top ${topic} Secrets Explained`,
      `${topic} Tutorial for Beginners`,
    ];
  }, [topic]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Generate YouTube Video Titles
        </h2>

        <p className="text-black/60 leading-7">
          Generate engaging YouTube titles for videos, Shorts and creator content.
        </p>
      </div>

      <input
        type="text"
        value={topic}
        onChange={(e) =>
          setTopic(e.target.value)
        }
        placeholder="Enter video topic..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid gap-4">
        {titles.map((title) => (
          <div
            key={title}
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 font-semibold"
          >
            {title}
          </div>
        ))}
      </div>
    </div>
  );
}