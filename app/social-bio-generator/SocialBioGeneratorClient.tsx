"use client";

import { useMemo, useState } from "react";

export default function SocialBioGeneratorClient() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("creator");

  const bios = useMemo(() => {
    const displayName = name.trim() || "Creator";
    const niche = topic.trim() || "content";

    if (style === "professional") {
      return [
        `${displayName} | Helping people with ${niche}`,
        `${displayName} — ${niche} specialist`,
        `Sharing practical insights about ${niche}`,
        `${niche} tips, ideas and resources by ${displayName}`,
      ];
    }

    if (style === "fun") {
      return [
        `${displayName} ✨ making ${niche} more fun`,
        `Just here for good vibes and ${niche}`,
        `${niche}, coffee and creative chaos`,
        `Creating ${niche} content with personality`,
      ];
    }

    return [
      `${displayName} | ${niche} creator`,
      `Daily ${niche} tips and ideas`,
      `Creating content about ${niche}`,
      `${niche} inspiration for curious minds`,
    ];
  }, [name, topic, style]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Social Bio Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate short bio ideas for Instagram, TikTok, YouTube, X and social profiles.
        </p>
      </div>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Name or brand..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        placeholder="Topic or niche..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <select
        value={style}
        onChange={(event) => setStyle(event.target.value)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="creator">Creator Style</option>
        <option value="professional">Professional Style</option>
        <option value="fun">Fun Style</option>
      </select>

      <div className="grid gap-3">
        {bios.map((bio) => (
          <div
            key={bio}
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 font-semibold break-words"
          >
            {bio}
          </div>
        ))}
      </div>
    </div>
  );
}