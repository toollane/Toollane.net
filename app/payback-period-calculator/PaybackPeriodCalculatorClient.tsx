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

export default function PaybackPeriodCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [initialInvestment, setInitialInvestment] = useState(25000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000);
  const [monthlyOperatingCosts, setMonthlyOperatingCosts] = useState(2200);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(3);
  const [discountRate, setDiscountRate] = useState(8);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      initialInvestment <= 0 ||
      monthlyRevenue < 0 ||
      monthlyOperatingCosts < 0 ||
      monthlyGrowthRate < 0 ||
      discountRate < 0
    ) {
      return null;
    }

    let cumulativeCashFlow = 0;
    let discountedCashFlow = 0;
    let paybackMonth: number | null = null;
    let discountedPaybackMonth: number | null = null;
    let currentRevenue = monthlyRevenue;
    const monthlyDiscountRate = discountRate / 100 / 12;

    for (let month = 1; month <= 600; month++) {
      const monthlyNetCashFlow = currentRevenue - monthlyOperatingCosts;

      cumulativeCashFlow += monthlyNetCashFlow;
      discountedCashFlow +=
        monthlyNetCashFlow / Math.pow(1 + monthlyDiscountRate, month);

      if (paybackMonth === null && cumulativeCashFlow >= initialInvestment) {
        paybackMonth = month;
      }

      if (
        discountedPaybackMonth === null &&
        discountedCashFlow >= initialInvestment
      ) {
        discountedPaybackMonth = month;
      }

      currentRevenue *= 1 + monthlyGrowthRate / 100;
    }

    const firstMonthCashFlow = monthlyRevenue - monthlyOperatingCosts;
    const roiAfterOneYear =
      initialInvestment > 0
        ? (((firstMonthCashFlow * 12) - initialInvestment) / initialInvestment) *
          100
        : 0;

    return {
      monthlyNetCashFlow: firstMonthCashFlow,
      paybackMonth,
      discountedPaybackMonth,
      roiAfterOneYear,
      annualNetCashFlow: firstMonthCashFlow * 12,
    };
  }, [
    initialInvestment,
    monthlyRevenue,
    monthlyOperatingCosts,
    monthlyGrowthRate,
    discountRate,
  ]);

  function validateInputs() {
    if (initialInvestment <= 0) {
      setError("Initial investment must be greater than zero.");
      return false;
    }

    if (
      monthlyRevenue < 0 ||
      monthlyOperatingCosts < 0 ||
      monthlyGrowthRate < 0 ||
      discountRate < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setInitialInvestment(25000);
    setMonthlyRevenue(5000);
    setMonthlyOperatingCosts(2200);
    setMonthlyGrowthRate(3);
    setDiscountRate(8);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate payback period
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how long it takes to recover an investment using monthly cash
          flow, growth and discounted payback assumptions.
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
          <NumberInput label="Initial investment" value={initialInvestment} onChange={setInitialInvestment} onBlur={validateInputs} />
          <NumberInput label="Monthly revenue" value={monthlyRevenue} onChange={setMonthlyRevenue} onBlur={validateInputs} />
          <NumberInput label="Monthly operating costs" value={monthlyOperatingCosts} onChange={setMonthlyOperatingCosts} onBlur={validateInputs} />
          <NumberInput label="Monthly revenue growth %" value={monthlyGrowthRate} onChange={setMonthlyGrowthRate} onBlur={validateInputs} />
          <NumberInput label="Annual discount rate %" value={discountRate} onChange={setDiscountRate} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Payback period estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Payback period" value={result.paybackMonth ? `${result.paybackMonth} months` : "Not reached"} highlight />
            <ResultCard label="Discounted payback" value={result.discountedPaybackMonth ? `${result.discountedPaybackMonth} months` : "Not reached"} />
            <ResultCard label="Monthly net cash flow" value={formatCurrency(result.monthlyNetCashFlow, currency)} />
            <ResultCard label="Annual net cash flow" value={formatCurrency(result.annualNetCashFlow, currency)} />
            <ResultCard label="Year 1 ROI" value={`${result.roiAfterOneYear.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid investment and cash flow values.
        </ToolInfoBox>
      )}
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