"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF ",
  JPY: "¥",
};

type CurrencyCode = keyof typeof currencySymbols;

type Scenario = {
  name: string;
  description: string;
  arpa: string;
  grossMargin: string;
  churnRate: string;
  cac: string;
};

const scenarios: Scenario[] = [
  {
    name: "Starter SaaS",
    description: "Low-price subscription with higher churn.",
    arpa: "29",
    grossMargin: "85",
    churnRate: "5",
    cac: "120",
  },
  {
    name: "Pro SaaS",
    description: "Mid-market SaaS with healthier retention.",
    arpa: "99",
    grossMargin: "85",
    churnRate: "3",
    cac: "350",
  },
  {
    name: "B2B SaaS",
    description: "Higher ARPA with lower monthly churn.",
    arpa: "499",
    grossMargin: "80",
    churnRate: "2",
    cac: "1800",
  },
  {
    name: "Subscription App",
    description: "Consumer subscription with lower ARPA.",
    arpa: "12",
    grossMargin: "90",
    churnRate: "8",
    cac: "35",
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const symbol = currencySymbols[currency];

  if (!Number.isFinite(value)) return `${symbol}0`;

  if (currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
  }

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0%";

  return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}

function formatMonths(value: number) {
  if (!Number.isFinite(value)) return "—";

  if (value >= 120) {
    return `${(value / 12).toFixed(1)} years`;
  }

  return `${value.toFixed(1)} months`;
}

function getHealthLabel(ratio: number | null) {
  if (ratio === null) {
    return {
      label: "CAC not entered",
      description: "Add CAC to calculate your LTV:CAC ratio.",
    };
  }

  if (ratio >= 5) {
    return {
      label: "Excellent",
      description: "Your LTV:CAC ratio is very strong.",
    };
  }

  if (ratio >= 3) {
    return {
      label: "Healthy",
      description: "A ratio around 3:1 or higher is generally attractive.",
    };
  }

  if (ratio >= 1) {
    return {
      label: "Needs improvement",
      description: "Your acquisition cost may be too high for this LTV.",
    };
  }

  return {
    label: "Unprofitable",
    description: "CAC is higher than estimated lifetime value.",
  };
}

export default function LtvCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [arpa, setArpa] = useState("99");
  const [grossMargin, setGrossMargin] = useState("85");
  const [churnRate, setChurnRate] = useState("3");
  const [cac, setCac] = useState("350");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const monthlyRevenue = parseNumber(arpa);
    const marginPercent = parseNumber(grossMargin);
    const churnPercent = parseNumber(churnRate);
    const acquisitionCost = parseNumber(cac);

    const marginDecimal = marginPercent / 100;
    const churnDecimal = churnPercent / 100;

    const monthlyGrossProfit = monthlyRevenue * marginDecimal;
    const estimatedLifetimeMonths =
      churnDecimal > 0 ? 1 / churnDecimal : Number.POSITIVE_INFINITY;
    const ltv =
      churnDecimal > 0
        ? monthlyGrossProfit / churnDecimal
        : Number.POSITIVE_INFINITY;

    const ltvToCac =
      acquisitionCost > 0 && Number.isFinite(ltv) ? ltv / acquisitionCost : null;

    const paybackMonths =
      acquisitionCost > 0 && monthlyGrossProfit > 0
        ? acquisitionCost / monthlyGrossProfit
        : null;

    const maxCacForThreeToOne = Number.isFinite(ltv) ? ltv / 3 : null;
    const maxCacForFourToOne = Number.isFinite(ltv) ? ltv / 4 : null;
    const maxCacForFiveToOne = Number.isFinite(ltv) ? ltv / 5 : null;

    const months = [1, 3, 6, 12, 24, 36];

    const projection = months.map((month) => {
      const retainedPercent =
        churnDecimal > 0 ? Math.pow(1 - churnDecimal, month) * 100 : 100;

      const cumulativeGrossProfit =
        churnDecimal > 0
          ? monthlyGrossProfit *
            ((1 - Math.pow(1 - churnDecimal, month)) / churnDecimal)
          : monthlyGrossProfit * month;

      return {
        month,
        retainedPercent,
        cumulativeGrossProfit,
        profitable:
          acquisitionCost > 0 ? cumulativeGrossProfit >= acquisitionCost : false,
      };
    });

    return {
      monthlyRevenue,
      marginPercent,
      churnPercent,
      acquisitionCost,
      marginDecimal,
      churnDecimal,
      monthlyGrossProfit,
      estimatedLifetimeMonths,
      ltv,
      ltvToCac,
      paybackMonths,
      maxCacForThreeToOne,
      maxCacForFourToOne,
      maxCacForFiveToOne,
      projection,
    };
  }, [arpa, grossMargin, churnRate, cac]);

  const health = getHealthLabel(result.ltvToCac);

  function validateInputs() {
    if (result.monthlyRevenue <= 0) {
      setError("Average revenue per account must be greater than zero.");
      return false;
    }

    if (result.marginPercent <= 0 || result.marginPercent > 100) {
      setError("Gross margin must be between 0% and 100%.");
      return false;
    }

    if (result.churnPercent <= 0 || result.churnPercent >= 100) {
      setError("Monthly churn rate must be greater than 0% and lower than 100%.");
      return false;
    }

    if (result.acquisitionCost < 0) {
      setError("Customer acquisition cost cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setArpa(scenario.arpa);
    setGrossMargin(scenario.grossMargin);
    setChurnRate(scenario.churnRate);
    setCac(scenario.cac);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate customer lifetime value
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate LTV from average monthly revenue, gross margin and monthly
          churn. Add CAC to calculate LTV:CAC ratio and payback period.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Estimated LTV"
          value={
            Number.isFinite(result.ltv)
              ? formatCurrency(result.ltv, currency)
              : "—"
          }
          highlight
        />

        <StatCard
          label="Lifetime"
          value={formatMonths(result.estimatedLifetimeMonths)}
        />

        <StatCard
          label="LTV:CAC"
          value={result.ltvToCac !== null ? `${result.ltvToCac.toFixed(2)}:1` : "—"}
        />
      </div>

      <ToolResultBox title="Inputs">
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
              <option value="CHF">CHF — Swiss Franc</option>
              <option value="JPY">JPY — Japanese Yen</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyInput
              label="Average revenue per account"
              value={arpa}
              onChange={setArpa}
              currency={currency}
              helper="Monthly revenue per customer or account."
            />

            <PercentInput
              label="Gross margin"
              value={grossMargin}
              onChange={setGrossMargin}
              helper="Revenue left after product/service delivery costs."
            />

            <PercentInput
              label="Monthly churn rate"
              value={churnRate}
              onChange={setChurnRate}
              helper="Percentage of customers lost each month."
            />

            <MoneyInput
              label="Customer acquisition cost"
              value={cac}
              onChange={setCac}
              currency={currency}
              helper="Optional, but needed for LTV:CAC and payback."
            />
          </div>

          <div>
            <div className="mb-3 text-sm font-bold text-black">
              Quick scenarios
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.name}
                  type="button"
                  onClick={() => applyScenario(scenario)}
                  className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:bg-black/[0.02]"
                >
                  <div className="text-sm font-black text-black">
                    {scenario.name}
                  </div>

                  <div className="mt-2 text-xs leading-5 text-black/50">
                    {scenario.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={validateInputs}
            className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Calculate LTV
          </button>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="LTV result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Monthly gross profit"
                value={formatCurrency(result.monthlyGrossProfit, currency)}
              />

              <StatCard
                label="Estimated LTV"
                value={
                  Number.isFinite(result.ltv)
                    ? formatCurrency(result.ltv, currency)
                    : "—"
                }
                highlight
              />

              <StatCard
                label="Customer lifetime"
                value={formatMonths(result.estimatedLifetimeMonths)}
              />

              <StatCard
                label="Payback period"
                value={
                  result.paybackMonths !== null
                    ? formatMonths(result.paybackMonths)
                    : "—"
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {health.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {health.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="CAC targets">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="3:1 target CAC"
                value={
                  result.maxCacForThreeToOne !== null
                    ? formatCurrency(result.maxCacForThreeToOne, currency)
                    : "—"
                }
                highlight
              />

              <StatCard
                label="4:1 target CAC"
                value={
                  result.maxCacForFourToOne !== null
                    ? formatCurrency(result.maxCacForFourToOne, currency)
                    : "—"
                }
              />

              <StatCard
                label="5:1 target CAC"
                value={
                  result.maxCacForFiveToOne !== null
                    ? formatCurrency(result.maxCacForFiveToOne, currency)
                    : "—"
                }
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-black/60">
              These values estimate the maximum CAC you could spend while
              keeping your target LTV:CAC ratio.
            </p>
          </ToolResultBox>

          <ToolResultBox title="Retention and lifetime value projection">
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-4 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Month</div>
                <div>Customers retained</div>
                <div>Cumulative gross profit</div>
                <div>Status</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projection.map((row) => (
                  <div
                    key={row.month}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-4 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Month
                      </div>
                      <div className="font-bold text-black">{row.month}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Customers retained
                      </div>
                      <div className="font-bold text-black">
                        {formatPercent(row.retainedPercent)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Cumulative gross profit
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.cumulativeGrossProfit, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Status
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          row.profitable
                            ? "bg-black text-white"
                            : "bg-black/5 text-black/60"
                        }`}
                      >
                        {row.profitable ? "CAC paid back" : "Building value"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ToolResultBox>
        </>
      )}

      <ToolInfoBox>
        LTV is an estimate based on your inputs. A common SaaS formula is ARPA ×
        gross margin ÷ monthly churn. Real customer lifetime value can change
        with expansion revenue, discounts, refunds, seasonality and retention
        behavior.
      </ToolInfoBox>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  currency,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: CurrencyCode;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
          {currencySymbols[currency]}
        </div>

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function PercentInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
          %
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
  );
}

function StatCard({
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
      className={`rounded-2xl border p-5 shadow-sm ${
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