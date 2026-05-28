"use client";

import { useMemo, useState } from "react";

export default function UtmBuilderClient() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");

  const result = useMemo(() => {
    if (!url) {
      return "";
    }

    const params =
      new URLSearchParams();

    if (source) {
      params.append(
        "utm_source",
        source
      );
    }

    if (medium) {
      params.append(
        "utm_medium",
        medium
      );
    }

    if (campaign) {
      params.append(
        "utm_campaign",
        campaign
      );
    }

    return `${url}?${params.toString()}`;
  }, [
    url,
    source,
    medium,
    campaign,
  ]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Build UTM URLs
        </h2>

        <p className="text-black/60 leading-7">
          Generate campaign tracking URLs for analytics and marketing campaigns.
        </p>
      </div>

      <div className="grid gap-6">
        <input
          type="text"
          value={url}
          onChange={(e) =>
            setUrl(e.target.value)
          }
          placeholder="https://example.com"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          type="text"
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
          placeholder="utm_source"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          type="text"
          value={medium}
          onChange={(e) =>
            setMedium(e.target.value)
          }
          placeholder="utm_medium"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          type="text"
          value={campaign}
          onChange={(e) =>
            setCampaign(e.target.value)
          }
          placeholder="utm_campaign"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Generated UTM URL
        </div>

        <div className="break-all text-xl font-bold">
          {result || "—"}
        </div>
      </div>
    </div>
  );
}