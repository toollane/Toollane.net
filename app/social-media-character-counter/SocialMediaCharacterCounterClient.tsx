"use client";

import { useMemo, useState } from "react";

export default function SocialMediaCharacterCounterClient() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const length = text.length;

    return {
      length,
      twitterRemaining: 280 - length,
      instagramRemaining: 2200 - length,
      tiktokRemaining: 2200 - length,
      youtubeRemaining: 100 - length,
    };
  }, [text]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Check Social Media Character Limits
        </h2>

        <p className="text-black/60 leading-7">
          Count characters for Twitter/X, Instagram, TikTok and YouTube content.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Paste caption, title or post..."
        rows={8}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["Total Characters", result.length],
          ["Twitter/X Remaining", result.twitterRemaining],
          ["Instagram Remaining", result.instagramRemaining],
          ["TikTok Remaining", result.tiktokRemaining],
          ["YouTube Title Remaining", result.youtubeRemaining],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white border border-black/10 rounded-3xl p-6"
          >
            <div className="text-sm text-black/50 mb-2">
              {label}
            </div>

            <div className="text-3xl font-bold">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}