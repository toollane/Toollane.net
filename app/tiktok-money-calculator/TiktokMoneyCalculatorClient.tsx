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

export default function TiktokMoneyCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [followers, setFollowers] = useState(100000);
  const [averageViews, setAverageViews] = useState(45000);
  const [likes, setLikes] = useState(3500);
  const [comments, setComments] = useState(180);
  const [shares, setShares] = useState(250);
  const [postsPerMonth, setPostsPerMonth] = useState(12);
  const [ratePerThousandViews, setRatePerThousandViews] = useState(20);
  const [creatorFundRpm, setCreatorFundRpm] = useState(0.5);
  const [affiliateRevenue, setAffiliateRevenue] = useState(400);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      followers < 0 ||
      averageViews < 0 ||
      likes < 0 ||
      comments < 0 ||
      shares < 0 ||
      postsPerMonth < 0 ||
      ratePerThousandViews < 0 ||
      creatorFundRpm < 0 ||
      affiliateRevenue < 0
    ) {
      return null;
    }

    const engagementRate =
      followers > 0 ? ((likes + comments + shares) / followers) * 100 : 0;
    const sponsoredPostRate = (averageViews / 1000) * ratePerThousandViews;
    const monthlySponsoredRevenue = sponsoredPostRate * postsPerMonth;
    const monthlyCreatorFund = ((averageViews * postsPerMonth) / 1000) * creatorFundRpm;
    const totalMonthlyRevenue =
      monthlySponsoredRevenue + monthlyCreatorFund + affiliateRevenue;

    return {
      engagementRate,
      sponsoredPostRate,
      monthlySponsoredRevenue,
      monthlyCreatorFund,
      totalMonthlyRevenue,
      annualRevenue: totalMonthlyRevenue * 12,
      viewToFollowerRate: followers > 0 ? (averageViews / followers) * 100 : 0,
    };
  }, [
    followers,
    averageViews,
    likes,
    comments,
    shares,
    postsPerMonth,
    ratePerThousandViews,
    creatorFundRpm,
    affiliateRevenue,
  ]);

  function validateInputs() {
    if (
      followers < 0 ||
      averageViews < 0 ||
      likes < 0 ||
      comments < 0 ||
      shares < 0 ||
      postsPerMonth < 0 ||
      ratePerThousandViews < 0 ||
      creatorFundRpm < 0 ||
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
    setFollowers(100000);
    setAverageViews(45000);
    setLikes(3500);
    setComments(180);
    setShares(250);
    setPostsPerMonth(12);
    setRatePerThousandViews(20);
    setCreatorFundRpm(0.5);
    setAffiliateRevenue(400);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Estimate TikTok earnings
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate TikTok creator revenue from average views, engagement,
          sponsored post rates, creator fund RPM and affiliate income.
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
          <NumberInput label="Average views per video" value={averageViews} onChange={setAverageViews} onBlur={validateInputs} />
          <NumberInput label="Average likes" value={likes} onChange={setLikes} onBlur={validateInputs} />
          <NumberInput label="Average comments" value={comments} onChange={setComments} onBlur={validateInputs} />
          <NumberInput label="Average shares" value={shares} onChange={setShares} onBlur={validateInputs} />
          <NumberInput label="Posts per month" value={postsPerMonth} onChange={setPostsPerMonth} onBlur={validateInputs} />
          <NumberInput label="Sponsored rate per 1,000 views" value={ratePerThousandViews} onChange={setRatePerThousandViews} onBlur={validateInputs} />
          <NumberInput label="Creator fund RPM" value={creatorFundRpm} onChange={setCreatorFundRpm} onBlur={validateInputs} />
          <NumberInput label="Monthly affiliate revenue" value={affiliateRevenue} onChange={setAffiliateRevenue} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="TikTok earnings estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Monthly revenue" value={formatCurrency(result.totalMonthlyRevenue, currency)} highlight />
            <ResultCard label="Annual revenue" value={formatCurrency(result.annualRevenue, currency)} />
            <ResultCard label="Sponsored post rate" value={formatCurrency(result.sponsoredPostRate, currency)} />
            <ResultCard label="Sponsored monthly revenue" value={formatCurrency(result.monthlySponsoredRevenue, currency)} />
            <ResultCard label="Creator fund estimate" value={formatCurrency(result.monthlyCreatorFund, currency)} />
            <ResultCard label="Engagement rate" value={formatPercent(result.engagementRate)} />
            <ResultCard label="View-to-follower rate" value={formatPercent(result.viewToFollowerRate)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid TikTok performance values.</ToolInfoBox>
      )}

      <ToolInfoBox>
        TikTok earnings vary by niche, country, audience quality, brand demand,
        retention, watch time and monetization program eligibility.
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