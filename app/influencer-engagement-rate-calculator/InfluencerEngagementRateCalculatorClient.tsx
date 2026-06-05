"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function InfluencerEngagementRateCalculatorClient() {
  const [followers, setFollowers] = useState(50000);
  const [likes, setLikes] = useState(1800);
  const [comments, setComments] = useState(120);
  const [shares, setShares] = useState(80);
  const [saves, setSaves] = useState(150);
  const [reach, setReach] = useState(22000);
  const [impressions, setImpressions] = useState(30000);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      followers < 0 ||
      likes < 0 ||
      comments < 0 ||
      shares < 0 ||
      saves < 0 ||
      reach < 0 ||
      impressions < 0
    ) {
      return null;
    }

    const totalEngagements = likes + comments + shares + saves;
    const engagementByFollowers =
      followers > 0 ? (totalEngagements / followers) * 100 : 0;
    const engagementByReach =
      reach > 0 ? (totalEngagements / reach) * 100 : 0;
    const engagementByImpressions =
      impressions > 0 ? (totalEngagements / impressions) * 100 : 0;
    const reachRate = followers > 0 ? (reach / followers) * 100 : 0;
    const saveRate = reach > 0 ? (saves / reach) * 100 : 0;
    const commentRate = reach > 0 ? (comments / reach) * 100 : 0;

    return {
      totalEngagements,
      engagementByFollowers,
      engagementByReach,
      engagementByImpressions,
      reachRate,
      saveRate,
      commentRate,
    };
  }, [followers, likes, comments, shares, saves, reach, impressions]);

  function validateInputs() {
    if (
      followers < 0 ||
      likes < 0 ||
      comments < 0 ||
      shares < 0 ||
      saves < 0 ||
      reach < 0 ||
      impressions < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setFollowers(50000);
    setLikes(1800);
    setComments(120);
    setShares(80);
    setSaves(150);
    setReach(22000);
    setImpressions(30000);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate influencer engagement rate
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Measure engagement rate by followers, reach and impressions using
          likes, comments, shares and saves.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Followers" value={followers} onChange={setFollowers} onBlur={validateInputs} />
          <NumberInput label="Likes" value={likes} onChange={setLikes} onBlur={validateInputs} />
          <NumberInput label="Comments" value={comments} onChange={setComments} onBlur={validateInputs} />
          <NumberInput label="Shares" value={shares} onChange={setShares} onBlur={validateInputs} />
          <NumberInput label="Saves" value={saves} onChange={setSaves} onBlur={validateInputs} />
          <NumberInput label="Reach" value={reach} onChange={setReach} onBlur={validateInputs} />
          <NumberInput label="Impressions" value={impressions} onChange={setImpressions} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Engagement result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Engagement by followers" value={formatPercent(result.engagementByFollowers)} highlight />
            <ResultCard label="Engagement by reach" value={formatPercent(result.engagementByReach)} />
            <ResultCard label="Engagement by impressions" value={formatPercent(result.engagementByImpressions)} />
            <ResultCard label="Total engagements" value={formatNumber(result.totalEngagements)} />
            <ResultCard label="Reach rate" value={formatPercent(result.reachRate)} />
            <ResultCard label="Save rate" value={formatPercent(result.saveRate)} />
            <ResultCard label="Comment rate" value={formatPercent(result.commentRate)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid influencer performance values to calculate engagement.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Engagement by reach is often more useful than engagement by followers,
        because not every follower sees every post.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
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
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}