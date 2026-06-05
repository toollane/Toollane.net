"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Platform =
  | "x"
  | "instagram-caption"
  | "instagram-bio"
  | "tiktok-caption"
  | "youtube-title"
  | "youtube-description"
  | "linkedin-post"
  | "facebook-post";

const platformLimits: Record<Platform, number> = {
  x: 280,
  "instagram-caption": 2200,
  "instagram-bio": 150,
  "tiktok-caption": 2200,
  "youtube-title": 100,
  "youtube-description": 5000,
  "linkedin-post": 3000,
  "facebook-post": 63206,
};

const platformLabels: Record<Platform, string> = {
  x: "X / Twitter post",
  "instagram-caption": "Instagram caption",
  "instagram-bio": "Instagram bio",
  "tiktok-caption": "TikTok caption",
  "youtube-title": "YouTube title",
  "youtube-description": "YouTube description",
  "linkedin-post": "LinkedIn post",
  "facebook-post": "Facebook post",
};

export default function SocialMediaCharacterCounterClient() {
  const [platform, setPlatform] = useState<Platform>("x");
  const [text, setText] = useState(
    "Write or paste your social media copy here to check character limits."
  );

  const result = useMemo(() => {
    const limit = platformLimits[platform];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? (text.match(/\b[\w'-]+\b/g) || []).length : 0;
    const hashtags = (text.match(/#[\p{L}\p{N}_]+/gu) || []).length;
    const mentions = (text.match(/@[\p{L}\p{N}_]+/gu) || []).length;
    const urls = (text.match(/https?:\/\/\S+|www\.\S+/g) || []).length;
    const remaining = limit - characters;
    const usagePercent = limit > 0 ? (characters / limit) * 100 : 0;
    const status =
      characters <= limit
        ? remaining < limit * 0.1
          ? "Close to limit"
          : "Within limit"
        : "Over limit";

    return {
      limit,
      characters,
      charactersNoSpaces,
      words,
      hashtags,
      mentions,
      urls,
      remaining,
      usagePercent,
      status,
    };
  }, [text, platform]);

  function clearText() {
    setText("");
  }

  function loadExample() {
    setPlatform("x");
    setText(
      "Write or paste your social media copy here to check character limits."
    );
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Count social media characters
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Check character limits for social posts, captions, bios, YouTube
          titles, LinkedIn posts and more.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Platform</span>

          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Platform)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            {Object.entries(platformLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[260px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
          placeholder="Paste your post, caption, bio or title here..."
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadExample}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Load example
          </button>

          <button
            type="button"
            onClick={clearText}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Clear text
          </button>
        </div>
      </div>

      <ToolResultBox title="Social media limit result">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard label="Status" value={result.status} highlight />
          <ResultCard label="Characters" value={`${result.characters.toLocaleString()} / ${result.limit.toLocaleString()}`} />
          <ResultCard label="Remaining" value={result.remaining.toLocaleString()} />
          <ResultCard label="Limit used" value={`${result.usagePercent.toFixed(1)}%`} />
          <ResultCard label="Words" value={result.words.toLocaleString()} />
          <ResultCard label="Characters no spaces" value={result.charactersNoSpaces.toLocaleString()} />
          <ResultCard label="Hashtags" value={result.hashtags.toLocaleString()} />
          <ResultCard label="Mentions" value={result.mentions.toLocaleString()} />
          <ResultCard label="URLs" value={result.urls.toLocaleString()} />
        </div>
      </ToolResultBox>

      <ToolInfoBox>
        Platform limits can change over time. This counter is designed for fast
        drafting and planning, not as an official publishing validation tool.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}