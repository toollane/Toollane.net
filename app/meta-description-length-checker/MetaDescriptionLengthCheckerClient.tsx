"use client";

import { useMemo, useState } from "react";

export default function MetaDescriptionLengthCheckerClient() {
  const [description, setDescription] = useState("");

  const result = useMemo(() => {
    const length = description.length;

    let status = "Too short";
    let advice =
      "Try adding more descriptive text.";

    if (length >= 120 && length <= 160) {
      status = "Good length";
      advice =
        "This description length is usually suitable for search snippets.";
    } else if (length > 160) {
      status = "Too long";
      advice =
        "Consider shortening the description to reduce truncation risk.";
    }

    return {
      length,
      status,
      advice,
    };
  }, [description]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Check Meta Description Length
        </h2>

        <p className="text-black/60 leading-7">
          Analyze your SEO meta description length for search engine snippets.
        </p>
      </div>

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder="Enter your meta description..."
        rows={5}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Characters
          </div>

          <div className="text-3xl font-bold">
            {result.length}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Status
          </div>

          <div className="text-3xl font-bold">
            {result.status}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          Recommendation
        </h3>

        <p className="text-black/60 leading-7">
          {result.advice}
        </p>
      </div>
    </div>
  );
}