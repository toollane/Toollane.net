"use client";

import { useMemo, useState } from "react";

const adjectives = [










];

const nouns = [










];

export default function UsernameGeneratorClient() {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("gaming");
  const [refreshKey, setRefreshKey] = useState(0);

  const usernames = useMemo(() => {
    const base = keyword.trim().replace(/\s+/g, "") || "User";

    return Array.from({ length: 10 }, (_, index) => {
      const adjective = adjectives[(index + refreshKey) % adjectives.length];
      const noun = nouns[(index * 2 + refreshKey) % nouns.length];
      const number = Math.floor(Math.random() * 9999);

      if (style === "clean") {
        return `${base}${number}`;
      }

      if (style === "social") {
        return `${base}.${adjective.toLowerCase()}`;
      }

      return `${adjective}${base}${noun}${number}`;
    });
  }, [keyword, style, refreshKey]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Username Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate username ideas for gaming, Instagram, TikTok, Discord and social media profiles.
        </p>
      </div>

      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Enter keyword or name..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <select
        value={style}
        onChange={(event) => setStyle(event.target.value)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="gaming">Gaming Style</option>
        <option value="social">Social Media Style</option>
        <option value="clean">Clean Style</option>
      </select>

      <button
        onClick={() => setRefreshKey((value) => value + 1)}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Generate Usernames
      </button>

      <div className="grid gap-3">
        {usernames.map((username) => (
          <div
            key={username}
            className="bg-white border border-black/10 rounded-2xl px-5 py-4 font-semibold break-words"
          >
            {username}
          </div>
        ))}
      </div>
    </div>
  );
}