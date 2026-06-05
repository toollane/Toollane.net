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

export default function RoasCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [adSpend, setAdSpend] = useState(3000);
  const [revenue, setRevenue] = useState(12000);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(4200);
  const [shippingCosts, setShippingCosts] = useState(800);
  const [platformFeesPercent, setPlatformFeesPercent] = useState(2.9);
  const [refundRate, setRefundRate] = useState(4);
  const [targetRoas, setTargetRoas] = useState(3);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      adSpend < 0 ||
      revenue < 0 ||
      costOfGoodsSold < 0 ||
      shippingCosts < 0 ||
      platformFeesPercent < 0 ||
      refundRate < 0 ||
      refundRate > 100 ||
      targetRoas < 0
    ) {
      return null;
    }

    const grossRoas = adSpend > 0 ? revenue / adSpend : 0;
    const refundLoss = revenue * (refundRate / 100);
    const platformFees = revenue * (platformFeesPercent / 100);
    const netRevenue = revenue - refundLoss;
    const totalNonAdCosts = costOfGoodsSold + shippingCosts + platformFees;
    const contributionProfit = netRevenue - totalNonAdCosts - adSpend;
    const contributionMargin =
      netRevenue > 0 ? (contributionProfit / netRevenue) * 100 : 0;

    const breakEvenRoas =
      revenue > 0 && adSpend > 0
        ? totalNonAdCosts / Math.max(1, adSpend) + 1
        : 0;

    const revenueNeededForTargetRoas = adSpend * targetRoas;
    const maxAdSpendAtCurrentRevenue =
      targetRoas > 0 ? revenue / targetRoas : 0;

    return {
      grossRoas,
      refundLoss,
      platformFees,
      netRevenue,
      totalNonAdCosts,
      contributionProfit,
      contributionMargin,
      breakEvenRoas,
      revenueNeededForTargetRoas,
      maxAdSpendAtCurrentRevenue,
      adSpendRatio: revenue > 0 ? (adSpend / revenue) * 100 : 0,
    };
  }, [
    adSpend,
    revenue,
    costOfGoodsSold,
    shippingCosts,
    platformFeesPercent,
    refundRate,
    targetRoas,
  ]);

  function validateInputs() {
    if (
      adSpend < 0 ||
      revenue < 0 ||
      costOfGoodsSold < 0 ||
      shippingCosts < 0 ||
      platformFeesPercent < 0 ||
      targetRoas < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (refundRate < 0 || refundRate > 100) {
      setError("Refund rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAdSpend(3000);
    setRevenue(12000);
    setCostOfGoodsSold(4200);
    setShippingCosts(800);
    setPlatformFeesPercent(2.9);
    setRefundRate(4);
    setTargetRoas(3);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate ROAS
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate return on ad spend and understand whether your ads are
          profitable after product costs, shipping, fees and refunds.
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
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Ad spend" value={adSpend} onChange={setAdSpend} onBlur={validateInputs} />
          <NumberInput label="Revenue from ads" value={revenue} onChange={setRevenue} onBlur={validateInputs} />
          <NumberInput label="Cost of goods sold" value={costOfGoodsSold} onChange={setCostOfGoodsSold} onBlur={validateInputs} />
          <NumberInput label="Shipping / fulfillment costs" value={shippingCosts} onChange={setShippingCosts} onBlur={validateInputs} />
          <NumberInput label="Platform fees %" value={platformFeesPercent} onChange={setPlatformFeesPercent} onBlur={validateInputs} />
          <NumberInput label="Refund rate %" value={refundRate} onChange={setRefundRate} onBlur={validateInputs} />
          <NumberInput label="Target ROAS" value={targetRoas} onChange={setTargetRoas} onBlur={validateInputs} />
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
        <ToolResultBox title="ROAS result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="ROAS" value={`${result.grossRoas.toFixed(2)}x`} highlight />
            <ResultCard label="Contribution profit" value={formatCurrency(result.contributionProfit, currency)} />
            <ResultCard label="Net revenue" value={formatCurrency(result.netRevenue, currency)} />
            <ResultCard label="Ad spend ratio" value={formatPercent(result.adSpendRatio)} />
            <ResultCard label="Contribution margin" value={formatPercent(result.contributionMargin)} />
            <ResultCard label="Break-even ROAS" value={`${result.breakEvenRoas.toFixed(2)}x`} />
            <ResultCard label="Refund loss" value={formatCurrency(result.refundLoss, currency)} />
            <ResultCard label="Platform fees" value={formatCurrency(result.platformFees, currency)} />
            <ResultCard label="Revenue needed for target ROAS" value={formatCurrency(result.revenueNeededForTargetRoas, currency)} />
            <ResultCard label="Max spend at current revenue" value={formatCurrency(result.maxAdSpendAtCurrentRevenue, currency)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your ROAS is{" "}
            <strong className="text-black">{result.grossRoas.toFixed(2)}x</strong>
            . After estimated costs, contribution profit is{" "}
            <strong className="text-black">
              {formatCurrency(result.contributionProfit, currency)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid ad spend, revenue and cost assumptions to calculate ROAS.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        ROAS shows revenue per ad dollar, but profitability also depends on
        product costs, fees, refunds, shipping and overhead.
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