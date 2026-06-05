"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

export default function UtmBuilderClient() {
  const [url, setUrl] = useState(
    "https://example.com"
  );

  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("spring-sale");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const result = useMemo(() => {
    try {
      const parsed = new URL(url);

      if (source) {
        parsed.searchParams.set("utm_source", source);
      }

      if (medium) {
        parsed.searchParams.set("utm_medium", medium);
      }

      if (campaign) {
        parsed.searchParams.set("utm_campaign", campaign);
      }

      if (term) {
        parsed.searchParams.set("utm_term", term);
      }

      if (content) {
        parsed.searchParams.set("utm_content", content);
      }

      return {
        valid: true,
        finalUrl: parsed.toString(),
      };
    } catch {
      return {
        valid: false,
        finalUrl: "",
      };
    }
  }, [
    url,
    source,
    medium,
    campaign,
    term,
    content,
  ]);

  async function copyResult() {
    if (result.valid) {
      await navigator.clipboard.writeText(
        result.finalUrl
      );
    }
  }

  function resetExample() {
    setUrl("https://example.com");
    setSource("newsletter");
    setMedium("email");
    setCampaign("spring-sale");
    setTerm("");
    setContent("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Build UTM tracking URLs
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create campaign URLs with UTM parameters for analytics, ads, email and
          marketing attribution.
        </p>
      </div>

      <div className="grid gap-4">
        <Input label="Website URL" value={url} onChange={setUrl} />
        <Input label="UTM Source" value={source} onChange={setSource} />
        <Input label="UTM Medium" value={medium} onChange={setMedium} />
        <Input label="UTM Campaign" value={campaign} onChange={setCampaign} />
        <Input label="UTM Term" value={term} onChange={setTerm} />
        <Input label="UTM Content" value={content} onChange={setContent} />
      </div>

      <ToolResultBox title="Generated tracking URL">
        <textarea
          readOnly
          value={result.finalUrl}
          className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm text-black outline-none"
        />
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          disabled={!result.valid}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Copy URL
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        UTM parameters help analytics platforms track traffic sources, campaigns
        and marketing performance.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}