"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ContentType = "post" | "story" | "reel" | "video" | "newsletter";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

const contentMultipliers: Record<ContentType, number> = {
  post: 1,
  story: 0.55,
  reel: 1.4,
  video: 1.8,
  newsletter: 1.25,
};

export default function SponsorshipRateCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [contentType, setContentType] = useState<ContentType>("reel");
  const [averageReach, setAverageReach] = useState(25000);
  const [engagementRate, setEngagementRate] = useState(4.5);
  const [baseCpm, setBaseCpm] = useState(25);
  const [usageRightsFee, setUsageRightsFee] = useState(500);
  const [exclusivityFee, setExclusivityFee] = useState(300);
  const [productionCost, setProductionCost] = useState(250);
  const [revisions, setRevisions] = useState(1);
  const [revisionFee, setRevisionFee] = useState(100);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      averageReach < 0 ||
      engagementRate < 0 ||
      baseCpm < 0 ||
      usageRightsFee < 0 ||
      exclusivityFee < 0 ||
      productionCost < 0 ||
      revisions < 0 ||
      revisionFee < 0
    ) {
      return null;
    }

    const mediaValue = (averageReach / 1000) * baseCpm;
    const engagementPremium = mediaValue * (engagementRate / 100);
    const contentMultiplier = contentMultipliers[contentType];
    const contentRate = (mediaValue + engagementPremium) * contentMultiplier;
    const revisionCost = revisions * revisionFee;
    const recommendedRate =
      contentRate + usageRightsFee + exclusivityFee + productionCost + revisionCost;

    return {
      mediaValue,
      engagementPremium,
      contentRate,
      revisionCost,
      recommendedRate,
      lowRate: recommendedRate * 0.8,
      highRate: recommendedRate * 1.25,
    };
  }, [
    averageReach,
    engagementRate,
    baseCpm,
    usageRightsFee,
    exclusivityFee,
    productionCost,
    revisions,
    revisionFee,
    contentType,
  ]);

  function validateInputs() {
    if (
      averageReach < 0 ||
      engagementRate < 0 ||
      baseCpm < 0 ||
      usageRightsFee < 0 ||
      exclusivityFee < 0 ||
      productionCost < 0 ||
      revisions < 0 ||
      revisionFee < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setContentType("reel");
    setAverageReach(25000);
    setEngagementRate(4.5);
    setBaseCpm(25);
    setUsageRightsFee(500);
    setExclusivityFee(300);
    setProductionCost(250);
    setRevisions(1);
    setRevisionFee(100);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate sponsorship rate
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate creator sponsorship pricing with reach, engagement, content
          type, usage rights, exclusivity, production cost and revisions.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
              <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Content type</span>
            <select value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
              <option value="post">Social post</option>
              <option value="story">Story</option>
              <option value="reel">Short video / reel</option>
              <option value="video">Long-form video</option>
              <option value="newsletter">Newsletter mention</option>
            </select>
          </label>

          <NumberInput label="Average reach" value={averageReach} onChange={setAverageReach} onBlur={validateInputs} />
          <NumberInput label="Engagement rate %" value={engagementRate} onChange={setEngagementRate} onBlur={validateInputs} />
          <NumberInput label="Base CPM" value={baseCpm} onChange={setBaseCpm} onBlur={validateInputs} />
          <NumberInput label="Usage rights fee" value={usageRightsFee} onChange={setUsageRightsFee} onBlur={validateInputs} />
          <NumberInput label="Exclusivity fee" value={exclusivityFee} onChange={setExclusivityFee} onBlur={validateInputs} />
          <NumberInput label="Production cost" value={productionCost} onChange={setProductionCost} onBlur={validateInputs} />
          <NumberInput label="Included revisions" value={revisions} onChange={setRevisions} onBlur={validateInputs} />
          <NumberInput label="Fee per revision" value={revisionFee} onChange={setRevisionFee} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Sponsorship rate estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Recommended rate" value={formatCurrency(result.recommendedRate, currency)} highlight />
            <ResultCard label="Suggested low range" value={formatCurrency(result.lowRate, currency)} />
            <ResultCard label="Suggested high range" value={formatCurrency(result.highRate, currency)} />
            <ResultCard label="Media value" value={formatCurrency(result.mediaValue, currency)} />
            <ResultCard label="Engagement premium" value={formatCurrency(result.engagementPremium, currency)} />
            <ResultCard label="Content rate" value={formatCurrency(result.contentRate, currency)} />
            <ResultCard label="Revision cost" value={formatCurrency(result.revisionCost, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid sponsorship assumptions.</ToolInfoBox>
      )}

      <ToolInfoBox>
        Real sponsorship rates depend on niche, audience quality, brand fit,
        deliverables, usage rights, exclusivity and negotiation power.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({ label, value, onChange, onBlur }: { label: string; value: number; onChange: (value: number) => void; onBlur: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}