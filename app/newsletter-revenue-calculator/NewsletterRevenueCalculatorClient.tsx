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

export default function NewsletterRevenueCalculatorClient() {
  const [subscribers, setSubscribers] = useState(25000);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(5);
  const [openRate, setOpenRate] = useState(42);
  const [clickRate, setClickRate] = useState(4.5);
  const [sendFrequencyPerWeek, setSendFrequencyPerWeek] = useState(2);

  const [sponsorshipCpm, setSponsorshipCpm] = useState(45);
  const [sponsorSlotsPerIssue, setSponsorSlotsPerIssue] = useState(1);
  const [sponsorFillRate, setSponsorFillRate] = useState(75);

  const [paidSubscriberRate, setPaidSubscriberRate] = useState(3);
  const [paidPlanPrice, setPaidPlanPrice] = useState(9);
  const [paidChurnRate, setPaidChurnRate] = useState(4);

  const [affiliateConversionRate, setAffiliateConversionRate] = useState(1.2);
  const [affiliateCommission, setAffiliateCommission] = useState(24);

  const result = useMemo(() => {
    const monthlyIssues = sendFrequencyPerWeek * 4.345;
    const opensPerIssue = subscribers * (openRate / 100);
    const clicksPerIssue = subscribers * (clickRate / 100);

    const sponsorshipRevenuePerIssue =
      (opensPerIssue / 1000) *
      sponsorshipCpm *
      sponsorSlotsPerIssue *
      (sponsorFillRate / 100);

    const monthlySponsorshipRevenue =
      sponsorshipRevenuePerIssue * monthlyIssues;

    const paidSubscribers =
      subscribers * (paidSubscriberRate / 100);

    const monthlyPaidRevenue =
      paidSubscribers * paidPlanPrice * (1 - paidChurnRate / 100);

    const monthlyAffiliateRevenue =
      clicksPerIssue *
      monthlyIssues *
      (affiliateConversionRate / 100) *
      affiliateCommission;

    const totalMonthlyRevenue =
      monthlySponsorshipRevenue + monthlyPaidRevenue + monthlyAffiliateRevenue;

    const totalAnnualRevenue = totalMonthlyRevenue * 12;
    const revenuePerSubscriber =
      subscribers > 0 ? totalMonthlyRevenue / subscribers : 0;

    const projectedSubscribers12m =
      subscribers * Math.pow(1 + monthlyGrowthRate / 100, 12);

    const projectedMonthlyRevenue12m =
      totalMonthlyRevenue * (projectedSubscribers12m / subscribers);

    return {
      monthlyIssues,
      opensPerIssue,
      clicksPerIssue,
      sponsorshipRevenuePerIssue,
      monthlySponsorshipRevenue,
      paidSubscribers,
      monthlyPaidRevenue,
      monthlyAffiliateRevenue,
      totalMonthlyRevenue,
      totalAnnualRevenue,
      revenuePerSubscriber,
      projectedSubscribers12m,
      projectedMonthlyRevenue12m,
    };
  }, [
    subscribers,
    monthlyGrowthRate,
    openRate,
    clickRate,
    sendFrequencyPerWeek,
    sponsorshipCpm,
    sponsorSlotsPerIssue,
    sponsorFillRate,
    paidSubscriberRate,
    paidPlanPrice,
    paidChurnRate,
    affiliateConversionRate,
    affiliateCommission,
  ]);

  async function copySummary() {
    const summary = [
      "Newsletter Revenue Estimate",
      `Subscribers: ${formatNumber(subscribers)}`,
      `Open rate: ${openRate}%`,
      `Click rate: ${clickRate}%`,
      `Issues per month: ${result.monthlyIssues.toFixed(1)}`,
      "",
      `Sponsorship revenue / month: ${formatMoney(result.monthlySponsorshipRevenue)}`,
      `Paid newsletter revenue / month: ${formatMoney(result.monthlyPaidRevenue)}`,
      `Affiliate revenue / month: ${formatMoney(result.monthlyAffiliateRevenue)}`,
      "",
      `Total monthly revenue: ${formatMoney(result.totalMonthlyRevenue)}`,
      `Total annual revenue: ${formatMoney(result.totalAnnualRevenue)}`,
      `Revenue per subscriber / month: ${formatMoney(result.revenuePerSubscriber)}`,
      `Projected subscribers after 12 months: ${formatNumber(result.projectedSubscribers12m)}`,
      `Projected monthly revenue after 12 months: ${formatMoney(result.projectedMonthlyRevenue12m)}`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
  }

  function resetExample() {
    setSubscribers(25000);
    setMonthlyGrowthRate(5);
    setOpenRate(42);
    setClickRate(4.5);
    setSendFrequencyPerWeek(2);
    setSponsorshipCpm(45);
    setSponsorSlotsPerIssue(1);
    setSponsorFillRate(75);
    setPaidSubscriberRate(3);
    setPaidPlanPrice(9);
    setPaidChurnRate(4);
    setAffiliateConversionRate(1.2);
    setAffiliateCommission(24);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Newsletter Revenue Calculator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Estimate newsletter revenue from sponsorships, paid subscriptions,
          affiliate offers and subscriber growth.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Complete newsletter monetization model
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Calculate sponsor revenue from CPM, open rate and fill rate</li>
          <li>• Estimate paid subscription MRR after churn</li>
          <li>• Include affiliate revenue from clicks and commissions</li>
          <li>• Forecast subscriber and revenue growth over 12 months</li>
        </ul>
      </div>

      <ToolResultBox title="Audience and engagement">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumberInput label="Subscribers" value={subscribers} onChange={setSubscribers} />
          <NumberInput label="Monthly growth %" value={monthlyGrowthRate} onChange={setMonthlyGrowthRate} />
          <NumberInput label="Open rate %" value={openRate} onChange={setOpenRate} />
          <NumberInput label="Click rate %" value={clickRate} onChange={setClickRate} />
          <NumberInput label="Sends per week" value={sendFrequencyPerWeek} onChange={setSendFrequencyPerWeek} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Sponsorship revenue">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput label="Sponsorship CPM" value={sponsorshipCpm} onChange={setSponsorshipCpm} />
          <NumberInput label="Sponsor slots / issue" value={sponsorSlotsPerIssue} onChange={setSponsorSlotsPerIssue} />
          <NumberInput label="Sponsor fill rate %" value={sponsorFillRate} onChange={setSponsorFillRate} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Paid newsletter revenue">
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberInput label="Paid subscriber rate %" value={paidSubscriberRate} onChange={setPaidSubscriberRate} />
          <NumberInput label="Paid plan price" value={paidPlanPrice} onChange={setPaidPlanPrice} />
          <NumberInput label="Monthly churn %" value={paidChurnRate} onChange={setPaidChurnRate} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Affiliate revenue">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Affiliate conversion %" value={affiliateConversionRate} onChange={setAffiliateConversionRate} />
          <NumberInput label="Commission per conversion" value={affiliateCommission} onChange={setAffiliateCommission} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="Revenue estimate">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard label="Monthly revenue" value={formatMoney(result.totalMonthlyRevenue)} highlight />
          <ResultCard label="Annual revenue" value={formatMoney(result.totalAnnualRevenue)} highlight />
          <ResultCard label="Revenue / subscriber" value={formatMoney(result.revenuePerSubscriber)} />
          <ResultCard label="Sponsorship / month" value={formatMoney(result.monthlySponsorshipRevenue)} />
          <ResultCard label="Paid subs / month" value={formatMoney(result.monthlyPaidRevenue)} />
          <ResultCard label="Affiliate / month" value={formatMoney(result.monthlyAffiliateRevenue)} />
          <ResultCard label="Opens / issue" value={formatNumber(result.opensPerIssue)} />
          <ResultCard label="Clicks / issue" value={formatNumber(result.clicksPerIssue)} />
          <ResultCard label="Issues / month" value={result.monthlyIssues.toFixed(1)} />
        </div>
      </ToolResultBox>

      <ToolResultBox title="12-month projection">
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard
            label="Projected subscribers"
            value={formatNumber(result.projectedSubscribers12m)}
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
        Newsletter revenue depends heavily on audience quality, niche, buyer
        intent, deliverability and sponsor demand. Use this calculator as a
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