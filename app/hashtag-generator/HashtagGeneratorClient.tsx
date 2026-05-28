"use client";

import { useMemo, useState } from "react";

export default function HashtagGeneratorClient() {
  const [topic, setTopic] =
    useState("");

  const [platform, setPlatform] =
    useState("instagram");

  const hashtags = useMemo(() => {
    const keyword =
      topic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    if (!keyword) {
      return [];
    }

    const common = [
      `#${keyword}`,
      `#${keyword}tips`,
      `#${keyword}life`,
      `#${keyword}content`,
      `#${keyword}creator`,
      `#daily${keyword}`,
      `#best${keyword}`,
      `#viral${keyword}`,
      `#${keyword}community`,
      `#${keyword}ideas`,
    ];

    if (platform === "tiktok") {
      return [
        ...common,
        "#fyp",
        "#viral",
        "#tiktok",
        "#foryou",
      ];
    }

    if (platform === "youtube") {
      return [
        ...common,
        "#shorts",
        "#youtube",
        "#youtubeshorts",
      ];
    }

    return [
      ...common,
      "#instagram",
      "#instagood",
      "#explorepage",
    ];
  }, [topic, platform]);

  const copyHashtags = async () => {
    if (!hashtags.length) {
      return;
    }

    await navigator.clipboard.writeText(
      hashtags.join(" ")
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Hashtag Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate trending hashtag
          ideas for Instagram,
          TikTok and YouTube
          instantly.
        </p>
      </div>

      <input
        value={topic}
        onChange={(event) =>
          setTopic(event.target.value)
        }
        placeholder="Enter topic or niche..."
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <select
        value={platform}
        onChange={(event) =>
          setPlatform(
            event.target.value
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="instagram">
          Instagram
        </option>

        <option value="tiktok">
          TikTok
        </option>

        <option value="youtube">
          YouTube Shorts
        </option>
      </select>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="flex flex-wrap gap-3">
          {hashtags.length ? (
            hashtags.map((tag) => (
              <div
                key={tag}
                className="bg-black text-white rounded-full px-4 py-2 text-sm font-semibold"
              >
                {tag}
              </div>
            ))
          ) : (
            <div className="text-black/40">
              Enter a topic to generate hashtags.
            </div>
          )}
        </div>
      </div>

      {hashtags.length > 0 && (
        <button
          onClick={copyHashtags}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
        >
          Copy Hashtags
        </button>
      )}
    </div>
  );
}