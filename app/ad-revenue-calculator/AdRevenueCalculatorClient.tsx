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
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdRevenueCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [pageviews, setPageviews] = useState(100000);
  const [adsPerPage, setAdsPerPage] = useState(3);
  const [viewabilityRate, setViewabilityRate] = useState(70);
  const [fillRate, setFillRate] = useState(90);
  const [cpm, setCpm] = useState(4);
  const [trafficGrowth, setTrafficGrowth] = useState(10);
  const [months, setMonths] = useState(12);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      pageviews < 0 ||
      adsPerPage < 0 ||
      viewabilityRate < 0 ||
      viewabilityRate > 100 ||
      fillRate < 0 ||
      fillRate > 100 ||
      cpm < 0 ||
      trafficGrowth < 0 ||
      months <= 0
    ) {
      return null;
    }

    const impressions =
      pageviews * adsPerPage * (viewabilityRate / 100) * (fillRate / 100);
    const monthlyRevenue = (impressions / 1000) * cpm;

    let forecastRevenue = 0;
    let forecastPageviews = pageviews;

    for (let month = 0; month < months; month++) {
      const monthlyImpressions =
        forecastPageviews *
        adsPerPage *
        (viewabilityRate / 100) *
        (fillRate / 100);

      forecastRevenue += (monthlyImpressions / 1000) * cpm;
      forecastPageviews *= 1 + trafficGrowth / 100;
    }

    return {
      impressions,
      monthlyRevenue,
      annualRevenue: monthlyRevenue * 12,
      rpm: pageviews > 0 ? (monthlyRevenue / pageviews) * 1000 : 0,
      forecastRevenue,
      finalMonthPageviews: forecastPageviews,
    };
  }, [
    pageviews,
    adsPerPage,
    viewabilityRate,
    fillRate,
    cpm,
    trafficGrowth,
    months,
  ]);

  function validateInputs() {
    if (pageviews < 0 || adsPerPage < 0 || cpm < 0 || trafficGrowth < 0) {
      setError("Values cannot be negative.");
      return false;
    }

    if (viewabilityRate > 100 || fillRate > 100) {
      setError("Viewability and fill rate must be between 0 and 100.");
      return false;
    }

    if (months <= 0) {
      setError("Forecast period must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setPageviews(100000);
    setAdsPerPage(3);
    setViewabilityRate(70);
    setFillRate(90);
    setCpm(4);
    setTrafficGrowth(10);
    setMonths(12);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate ad revenue
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate display ad revenue from pageviews, ads per page, viewability,
          fill rate, CPM and traffic growth.
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
          <NumberInput label="Monthly pageviews" value={pageviews} onChange={setPageviews} onBlur={validateInputs} />
          <NumberInput label="Ads per page" value={adsPerPage} onChange={setAdsPerPage} onBlur={validateInputs} />
          <NumberInput label="Viewability %" value={viewabilityRate} onChange={setViewabilityRate} onBlur={validateInputs} />
          <NumberInput label="Fill rate %" value={fillRate} onChange={setFillRate} onBlur={validateInputs} />
          <NumberInput label="CPM" value={cpm} onChange={setCpm} onBlur={validateInputs} />
          <NumberInput label="Monthly traffic growth %" value={trafficGrowth} onChange={setTrafficGrowth} onBlur={validateInputs} />
          <NumberInput label="Forecast months" value={months} onChange={setMonths} onBlur={validateInputs} />
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
        <ToolResultBox title="Ad revenue estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Monthly revenue" value={formatCurrency(result.monthlyRevenue, currency)} highlight />
            <ResultCard label="Annual revenue" value={formatCurrency(result.annualRevenue, currency)} />
            <ResultCard label="Monthly ad impressions" value={formatNumber(result.impressions)} />
            <ResultCard label="Page RPM" value={formatCurrency(result.rpm, currency)} />
            <ResultCard label={`${months}-month forecast`} value={formatCurrency(result.forecastRevenue, currency)} />
            <ResultCard label="Final month pageviews" value={formatNumber(result.finalMonthPageviews)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid ad assumptions to calculate estimated revenue.
        </ToolInfoBox>
      )}
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
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>
        {label}
      </div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}