"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function InstagramMoneyCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [followers, setFollowers] = useState(50000);
  const [avgLikes, setAvgLikes] = useState(1800);
  const [avgComments, setAvgComments] = useState(120);
  const [avgReach, setAvgReach] = useState(22000);
  const [postsPerMonth, setPostsPerMonth] = useState(4);
  const [ratePerThousandReach, setRatePerThousandReach] = useState(25);
  const [affiliateRevenue, setAffiliateRevenue] = useState(300);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      followers < 0 ||
      avgLikes < 0 ||
      avgComments < 0 ||
      avgReach < 0 ||
      postsPerMonth < 0 ||
      ratePerThousandReach < 0 ||
      affiliateRevenue < 0
    ) {
      return null;
    }

    const engagementRate =
      followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;
    const sponsoredPostRate = (avgReach / 1000) * ratePerThousandReach;
    const monthlySponsoredRevenue = sponsoredPostRate * postsPerMonth;
    const totalMonthlyRevenue = monthlySponsoredRevenue + affiliateRevenue;

    return {
      engagementRate,
      sponsoredPostRate,
      monthlySponsoredRevenue,
      totalMonthlyRevenue,
      annualRevenue: totalMonthlyRevenue * 12,
      reachRate: followers > 0 ? (avgReach / followers) * 100 : 0,
    };
  }, [
    followers,
    avgLikes,
    avgComments,
    avgReach,
    postsPerMonth,
    ratePerThousandReach,
    affiliateRevenue,
  ]);

  function validateInputs() {
    if (
      followers < 0 ||
      avgLikes < 0 ||
      avgComments < 0 ||
      avgReach < 0 ||
      postsPerMonth < 0 ||
      ratePerThousandReach < 0 ||
      affiliateRevenue < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setFollowers(50000);
    setAvgLikes(1800);
    setAvgComments(120);
    setAvgReach(22000);
    setPostsPerMonth(4);
    setRatePerThousandReach(25);
    setAffiliateRevenue(300);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Estimate Instagram earnings
        </h2>
        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate Instagram sponsored post rates and monthly creator revenue
          from followers, reach, engagement and posting frequency.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Followers" value={followers} onChange={setFollowers} onBlur={validateInputs} />
          <NumberInput label="Average likes" value={avgLikes} onChange={setAvgLikes} onBlur={validateInputs} />
          <NumberInput label="Average comments" value={avgComments} onChange={setAvgComments} onBlur={validateInputs} />
          <NumberInput label="Average reach per post" value={avgReach} onChange={setAvgReach} onBlur={validateInputs} />
          <NumberInput label="Sponsored posts per month" value={postsPerMonth} onChange={setPostsPerMonth} onBlur={validateInputs} />
          <NumberInput label="Rate per 1,000 reach" value={ratePerThousandReach} onChange={setRatePerThousandReach} onBlur={validateInputs} />
          <NumberInput label="Monthly affiliate revenue" value={affiliateRevenue} onChange={setAffiliateRevenue} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Instagram earnings estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Sponsored post rate" value={formatCurrency(result.sponsoredPostRate, currency)} highlight />
            <ResultCard label="Monthly revenue" value={formatCurrency(result.totalMonthlyRevenue, currency)} />
            <ResultCard label="Annual revenue" value={formatCurrency(result.annualRevenue, currency)} />
            <ResultCard label="Engagement rate" value={formatPercent(result.engagementRate)} />
            <ResultCard label="Reach rate" value={formatPercent(result.reachRate)} />
            <ResultCard label="Sponsored monthly revenue" value={formatCurrency(result.monthlySponsoredRevenue, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid Instagram performance values.</ToolInfoBox>
      )}

      <ToolInfoBox>
        Creator rates vary by niche, country, audience quality, deliverables,
        exclusivity, usage rights and brand demand.
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