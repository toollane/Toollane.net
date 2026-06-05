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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export default function YoutubeMoneyCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [monthlyViews, setMonthlyViews] = useState(500000);
  const [playbackCpm, setPlaybackCpm] = useState(6);
  const [monetizedPlaybackRate, setMonetizedPlaybackRate] = useState(55);
  const [youtubeShare, setYoutubeShare] = useState(45);
  const [sponsorRevenue, setSponsorRevenue] = useState(1000);
  const [affiliateRevenue, setAffiliateRevenue] = useState(500);
  const [membershipRevenue, setMembershipRevenue] = useState(250);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      monthlyViews < 0 ||
      playbackCpm < 0 ||
      monetizedPlaybackRate < 0 ||
      monetizedPlaybackRate > 100 ||
      youtubeShare < 0 ||
      youtubeShare > 100 ||
      sponsorRevenue < 0 ||
      affiliateRevenue < 0 ||
      membershipRevenue < 0
    ) {
      return null;
    }

    const monetizedViews = monthlyViews * (monetizedPlaybackRate / 100);
    const grossAdRevenue = (monetizedViews / 1000) * playbackCpm;
    const creatorAdRevenue = grossAdRevenue * (1 - youtubeShare / 100);
    const totalMonthlyRevenue =
      creatorAdRevenue + sponsorRevenue + affiliateRevenue + membershipRevenue;

    return {
      monetizedViews,
      grossAdRevenue,
      creatorAdRevenue,
      totalMonthlyRevenue,
      annualRevenue: totalMonthlyRevenue * 12,
      rpm: monthlyViews > 0 ? (totalMonthlyRevenue / monthlyViews) * 1000 : 0,
    };
  }, [
    monthlyViews,
    playbackCpm,
    monetizedPlaybackRate,
    youtubeShare,
    sponsorRevenue,
    affiliateRevenue,
    membershipRevenue,
  ]);

  function validateInputs() {
    if (
      monthlyViews < 0 ||
      playbackCpm < 0 ||
      sponsorRevenue < 0 ||
      affiliateRevenue < 0 ||
      membershipRevenue < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (
      monetizedPlaybackRate < 0 ||
      monetizedPlaybackRate > 100 ||
      youtubeShare < 0 ||
      youtubeShare > 100
    ) {
      setError("Percentage values must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setMonthlyViews(500000);
    setPlaybackCpm(6);
    setMonetizedPlaybackRate(55);
    setYoutubeShare(45);
    setSponsorRevenue(1000);
    setAffiliateRevenue(500);
    setMembershipRevenue(250);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Estimate YouTube earnings
        </h2>
        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate YouTube revenue from views, CPM, monetized playback rate,
          platform share, sponsorships, affiliates and memberships.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Monthly views" value={monthlyViews} onChange={setMonthlyViews} onBlur={validateInputs} />
          <NumberInput label="Playback CPM" value={playbackCpm} onChange={setPlaybackCpm} onBlur={validateInputs} />
          <NumberInput label="Monetized playback rate %" value={monetizedPlaybackRate} onChange={setMonetizedPlaybackRate} onBlur={validateInputs} />
          <NumberInput label="YouTube platform share %" value={youtubeShare} onChange={setYoutubeShare} onBlur={validateInputs} />
          <NumberInput label="Monthly sponsorship revenue" value={sponsorRevenue} onChange={setSponsorRevenue} onBlur={validateInputs} />
          <NumberInput label="Monthly affiliate revenue" value={affiliateRevenue} onChange={setAffiliateRevenue} onBlur={validateInputs} />
          <NumberInput label="Monthly membership revenue" value={membershipRevenue} onChange={setMembershipRevenue} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="YouTube earnings estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Monthly revenue" value={formatCurrency(result.totalMonthlyRevenue, currency)} highlight />
            <ResultCard label="Annual revenue" value={formatCurrency(result.annualRevenue, currency)} />
            <ResultCard label="Creator ad revenue" value={formatCurrency(result.creatorAdRevenue, currency)} />
            <ResultCard label="Gross ad revenue" value={formatCurrency(result.grossAdRevenue, currency)} />
            <ResultCard label="Monetized views" value={formatNumber(result.monetizedViews)} />
            <ResultCard label="Total RPM" value={formatCurrency(result.rpm, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Enter valid YouTube monetization assumptions.</ToolInfoBox>
      )}

      <ToolInfoBox>
        YouTube earnings vary heavily by niche, country, video length,
        seasonality, ad inventory and monetization mix.
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