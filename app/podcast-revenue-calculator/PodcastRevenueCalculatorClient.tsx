"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export default function PodcastRevenueCalculatorClient() {
  const [downloadsPerEpisode, setDownloadsPerEpisode] = useState(12000);
  const [episodesPerMonth, setEpisodesPerMonth] = useState(4);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(6);

  const [hostReadCpm, setHostReadCpm] = useState(35);
  const [programmaticCpm, setProgrammaticCpm] = useState(18);
  const [hostReadSlots, setHostReadSlots] = useState(1);
  const [programmaticSlots, setProgrammaticSlots] = useState(2);
  const [adFillRate, setAdFillRate] = useState(70);

  const [memberConversionRate, setMemberConversionRate] = useState(1.5);
  const [membershipPrice, setMembershipPrice] = useState(7);
  const [membershipChurnRate, setMembershipChurnRate] = useState(4);

  const [affiliateClickRate, setAffiliateClickRate] = useState(2.5);
  const [affiliateConversionRate, setAffiliateConversionRate] = useState(3);
  const [affiliateCommission, setAffiliateCommission] = useState(20);

  const [productionCostPerEpisode, setProductionCostPerEpisode] = useState(250);
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(300);

  const result = useMemo(() => {
    const monthlyDownloads = downloadsPerEpisode * episodesPerMonth;

    const effectiveAdDownloads = monthlyDownloads * (adFillRate / 100);

    const hostReadRevenue =
      (effectiveAdDownloads / 1000) * hostReadCpm * hostReadSlots;

    const programmaticRevenue =
      (effectiveAdDownloads / 1000) * programmaticCpm * programmaticSlots;

    const estimatedAudience = downloadsPerEpisode;
    const members = estimatedAudience * (memberConversionRate / 100);

    const membershipRevenue =
      members * membershipPrice * (1 - membershipChurnRate / 100);

    const affiliateClicks = monthlyDownloads * (affiliateClickRate / 100);

    const affiliateRevenue =
      affiliateClicks * (affiliateConversionRate / 100) * affiliateCommission;

    const grossRevenue =
      hostReadRevenue +
      programmaticRevenue +
      membershipRevenue +
      affiliateRevenue;

    const productionCosts =
      productionCostPerEpisode * episodesPerMonth + monthlyFixedCosts;

    const netProfit = grossRevenue - productionCosts;

    const annualGrossRevenue = grossRevenue * 12;
    const annualNetProfit = netProfit * 12;

    const revenuePerDownload =
      monthlyDownloads > 0 ? grossRevenue / monthlyDownloads : 0;

    const profitMargin =
      grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    const projectedDownloads12m =
      downloadsPerEpisode * Math.pow(1 + monthlyGrowthRate / 100, 12);

    const projectedMonthlyRevenue12m =
      grossRevenue * (projectedDownloads12m / downloadsPerEpisode);

    return {
      monthlyDownloads,
      effectiveAdDownloads,
      hostReadRevenue,
      programmaticRevenue,
      members,
      membershipRevenue,
      affiliateClicks,
      affiliateRevenue,
      grossRevenue,
      productionCosts,
      netProfit,
      annualGrossRevenue,
      annualNetProfit,
      revenuePerDownload,
      profitMargin,
      projectedDownloads12m,
      projectedMonthlyRevenue12m,
    };
  }, [
    downloadsPerEpisode,
    episodesPerMonth,
    monthlyGrowthRate,
    hostReadCpm,
    programmaticCpm,
    hostReadSlots,
    programmaticSlots,
    adFillRate,
    memberConversionRate,
    membershipPrice,
    membershipChurnRate,
    affiliateClickRate,
    affiliateConversionRate,
    affiliateCommission,
    productionCostPerEpisode,
    monthlyFixedCosts,
  ]);

  async function copySummary() {
    const summary = [
      "Podcast Revenue Estimate",
      `Downloads per episode: ${formatNumber(downloadsPerEpisode)}`,
      `Episodes per month: ${episodesPerMonth}`,
      `Monthly downloads: ${formatNumber(result.monthlyDownloads)}`,
      "",
      `Host-read ads / month: ${formatMoney(result.hostReadRevenue)}`,
      `Programmatic ads / month: ${formatMoney(result.programmaticRevenue)}`,
      `Membership revenue / month: ${formatMoney(result.membershipRevenue)}`,
      `Affiliate revenue / month: ${formatMoney(result.affiliateRevenue)}`,
      "",
      `Gross monthly revenue: ${formatMoney(result.grossRevenue)}`,
      `Monthly costs: ${formatMoney(result.productionCosts)}`,
      `Net monthly profit: ${formatMoney(result.netProfit)}`,
      `Annual net profit: ${formatMoney(result.annualNetProfit)}`,
      `Revenue per download: ${formatMoney(result.revenuePerDownload)}`,
      `Profit margin: ${result.profitMargin.toFixed(1)}%`,
      "",
      `Projected downloads per episode after 12 months: ${formatNumber(result.projectedDownloads12m)}`,
      `Projected monthly revenue after 12 months: ${formatMoney(result.projectedMonthlyRevenue12m)}`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
  }

  function resetExample() {
    setDownloadsPerEpisode(12000);
    setEpisodesPerMonth(4);
    setMonthlyGrowthRate(6);
    setHostReadCpm(35);
    setProgrammaticCpm(18);
    setHostReadSlots(1);
    setProgrammaticSlots(2);
    setAdFillRate(70);
    setMemberConversionRate(1.5);
    setMembershipPrice(7);
    setMembershipChurnRate(4);
    setAffiliateClickRate(2.5);
    setAffiliateConversionRate(3);
    setAffiliateCommission(20);
    setProductionCostPerEpisode(250);
    setMonthlyFixedCosts(300);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Podcast Revenue Calculator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Estimate podcast revenue from host-read ads, programmatic ads,
          memberships, affiliate offers and production costs.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Complete podcast monetization model
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Calculate revenue from host-read and programmatic ad CPMs</li>
          <li>• Add membership revenue with churn adjustment</li>
          <li>• Estimate affiliate commissions from listener actions</li>
          <li>• Include production costs to estimate net profit</li>
        </ul>
      </div>

      <ToolResultBox title="Audience and publishing">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput
            label="Downloads per episode"
            value={downloadsPerEpisode}
            onChange={setDownloadsPerEpisode}
          />
          <NumberInput
            label="Episodes per month"
            value={episodesPerMonth}
            onChange={setEpisodesPerMonth}
          />
          <NumberInput
            label="Monthly growth %"
            value={monthlyGrowthRate}
            onChange={setMonthlyGrowthRate}
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Advertising revenue">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumberInput label="Host-read CPM" value={hostReadCpm} onChange={setHostReadCpm} />
          <NumberInput label="Programmatic CPM" value={programmaticCpm} onChange={setProgrammaticCpm} />
          <NumberInput label="Host-read slots" value={hostReadSlots} onChange={setHostReadSlots} />
          <NumberInput label="Programmatic slots" value={programmaticSlots} onChange={setProgrammaticSlots} />
          <NumberInput label="Ad fill rate %" value={adFillRate} onChange={setAdFillRate} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Membership revenue">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput
            label="Member conversion %"
            value={memberConversionRate}
            onChange={setMemberConversionRate}
          />
          <NumberInput
            label="Membership price"
            value={membershipPrice}
            onChange={setMembershipPrice}
          />
          <NumberInput
            label="Monthly churn %"
            value={membershipChurnRate}
            onChange={setMembershipChurnRate}
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Affiliate revenue">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput
            label="Affiliate click rate %"
            value={affiliateClickRate}
            onChange={setAffiliateClickRate}
          />
          <NumberInput
            label="Affiliate conversion %"
            value={affiliateConversionRate}
            onChange={setAffiliateConversionRate}
          />
          <NumberInput
            label="Commission per sale"
            value={affiliateCommission}
            onChange={setAffiliateCommission}
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Production costs">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Production cost / episode"
            value={productionCostPerEpisode}
            onChange={setProductionCostPerEpisode}
          />
          <NumberInput
            label="Monthly fixed costs"
            value={monthlyFixedCosts}
            onChange={setMonthlyFixedCosts}
          />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Podcast revenue estimate">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard label="Gross monthly revenue" value={formatMoney(result.grossRevenue)} highlight />
          <ResultCard label="Net monthly profit" value={formatMoney(result.netProfit)} highlight />
          <ResultCard label="Annual net profit" value={formatMoney(result.annualNetProfit)} highlight />
          <ResultCard label="Monthly downloads" value={formatNumber(result.monthlyDownloads)} />
          <ResultCard label="Effective ad downloads" value={formatNumber(result.effectiveAdDownloads)} />
          <ResultCard label="Revenue / download" value={formatMoney(result.revenuePerDownload)} />
          <ResultCard label="Host-read ads" value={formatMoney(result.hostReadRevenue)} />
          <ResultCard label="Programmatic ads" value={formatMoney(result.programmaticRevenue)} />
          <ResultCard label="Membership revenue" value={formatMoney(result.membershipRevenue)} />
          <ResultCard label="Affiliate revenue" value={formatMoney(result.affiliateRevenue)} />
          <ResultCard label="Production costs" value={formatMoney(result.productionCosts)} />
          <ResultCard label="Profit margin" value={`${result.profitMargin.toFixed(1)}%`} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="12-month growth projection">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="Projected downloads / episode"
            value={formatNumber(result.projectedDownloads12m)}
          />
          <ResultCard
            label="Projected monthly revenue"
            value={formatMoney(result.projectedMonthlyRevenue12m)}
          />
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copySummary}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy summary
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Podcast revenue varies by niche, audience quality, geography, ad demand,
        advertiser relationships and listener loyalty. Use this calculator as a
        planning model, not a guaranteed forecast.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
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
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}