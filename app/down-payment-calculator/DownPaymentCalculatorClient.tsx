"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

const presets = [
  {
    name: "Starter home",
    description: "Moderate home price with a 10% down payment target.",
    values: {
      homePrice: "350000",
      targetDownPaymentPercent: "10",
      closingCostRate: "3",
      currentSavings: "18000",
      monthlySavings: "1500",
      annualReturnRate: "2",
    },
  },
  {
    name: "Low down payment",
    description: "Lower upfront target with more focus on closing cash.",
    values: {
      homePrice: "325000",
      targetDownPaymentPercent: "5",
      closingCostRate: "3.5",
      currentSavings: "9000",
      monthlySavings: "1200",
      annualReturnRate: "1.5",
    },
  },
  {
    name: "20% target",
    description: "Larger down payment target for a stronger financing position.",
    values: {
      homePrice: "500000",
      targetDownPaymentPercent: "20",
      closingCostRate: "3",
      currentSavings: "45000",
      monthlySavings: "2500",
      annualReturnRate: "2.5",
    },
  },
  {
    name: "High-cost market",
    description: "Higher purchase price with a larger cash target.",
    values: {
      homePrice: "800000",
      targetDownPaymentPercent: "15",
      closingCostRate: "4",
      currentSavings: "70000",
      monthlySavings: "3500",
      annualReturnRate: "2",
    },
  },
];

const targetPercentOptions = [3, 5, 10, 15, 20];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: Currency) {
  const rounded = currency === "JPY" ? Math.round(value) : value;

  return `${currencySymbols[currency]}${rounded.toLocaleString(undefined, {
    maximumFractionDigits: currency === "JPY" ? 0 : 0,
  })}`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

function formatMonths(months: number | null) {
  if (months === null) {
    return "Not reachable";
  }

  if (months <= 0) {
    return "Ready now";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
  }

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
}

function getMonthsToReachTarget({
  currentSavings,
  monthlySavings,
  annualReturnRate,
  target,
}: {
  currentSavings: number;
  monthlySavings: number;
  annualReturnRate: number;
  target: number;
}) {
  if (target <= 0 || currentSavings >= target) {
    return 0;
  }

  const monthlyReturnRate = Math.max(0, annualReturnRate) / 100 / 12;

  if (monthlySavings <= 0 && monthlyReturnRate <= 0) {
    return null;
  }

  let balance = currentSavings;

  for (let month = 1; month <= 600; month += 1) {
    balance = balance * (1 + monthlyReturnRate) + monthlySavings;

    if (balance >= target) {
      return month;
    }
  }

  return null;
}

export default function DownPaymentCalculatorClient() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const [homePrice, setHomePrice] = useState("350000");
  const [targetDownPaymentPercent, setTargetDownPaymentPercent] =
    useState("10");
  const [closingCostRate, setClosingCostRate] = useState("3");

  const [currentSavings, setCurrentSavings] = useState("18000");
  const [monthlySavings, setMonthlySavings] = useState("1500");
  const [annualReturnRate, setAnnualReturnRate] = useState("2");

  const result = useMemo(() => {
    const homePriceValue = Math.max(0, parseNumber(homePrice));
    const downPaymentPercentValue = Math.max(
      0,
      parseNumber(targetDownPaymentPercent)
    );
    const closingCostRateValue = Math.max(0, parseNumber(closingCostRate));

    const currentSavingsValue = Math.max(0, parseNumber(currentSavings));
    const monthlySavingsValue = Math.max(0, parseNumber(monthlySavings));
    const annualReturnRateValue = Math.max(0, parseNumber(annualReturnRate));

    const targetDownPayment =
      homePriceValue * (downPaymentPercentValue / 100);

    const estimatedClosingCosts = homePriceValue * (closingCostRateValue / 100);

    const totalCashTarget = targetDownPayment + estimatedClosingCosts;

    const savingsGap = Math.max(0, totalCashTarget - currentSavingsValue);
    const savingsSurplus = Math.max(0, currentSavingsValue - totalCashTarget);

    const loanAmount = Math.max(0, homePriceValue - targetDownPayment);

    const progressPercent =
      totalCashTarget > 0
        ? Math.min((currentSavingsValue / totalCashTarget) * 100, 100)
        : 0;

    const monthsToTarget = getMonthsToReachTarget({
      currentSavings: currentSavingsValue,
      monthlySavings: monthlySavingsValue,
      annualReturnRate: annualReturnRateValue,
      target: totalCashTarget,
    });

    const balanceAfter12Months = projectSavingsBalance({
      currentSavings: currentSavingsValue,
      monthlySavings: monthlySavingsValue,
      annualReturnRate: annualReturnRateValue,
      months: 12,
    });

    const balanceAfter24Months = projectSavingsBalance({
      currentSavings: currentSavingsValue,
      monthlySavings: monthlySavingsValue,
      annualReturnRate: annualReturnRateValue,
      months: 24,
    });

    const balanceAfter36Months = projectSavingsBalance({
      currentSavings: currentSavingsValue,
      monthlySavings: monthlySavingsValue,
      annualReturnRate: annualReturnRateValue,
      months: 36,
    });

    const monthlyNeeded12 = savingsGap / 12;
    const monthlyNeeded24 = savingsGap / 24;
    const monthlyNeeded36 = savingsGap / 36;

    const targetOptions = targetPercentOptions.map((percent) => {
      const downPayment = homePriceValue * (percent / 100);
      const cashTarget = downPayment + estimatedClosingCosts;
      const gap = Math.max(0, cashTarget - currentSavingsValue);

      return {
        percent,
        downPayment,
        cashTarget,
        gap,
      };
    });

    return {
      homePriceValue,
      downPaymentPercentValue,
      closingCostRateValue,
      currentSavingsValue,
      monthlySavingsValue,
      annualReturnRateValue,
      targetDownPayment,
      estimatedClosingCosts,
      totalCashTarget,
      savingsGap,
      savingsSurplus,
      loanAmount,
      progressPercent,
      monthsToTarget,
      balanceAfter12Months,
      balanceAfter24Months,
      balanceAfter36Months,
      monthlyNeeded12,
      monthlyNeeded24,
      monthlyNeeded36,
      targetOptions,
    };
  }, [
    homePrice,
    targetDownPaymentPercent,
    closingCostRate,
    currentSavings,
    monthlySavings,
    annualReturnRate,
  ]);

  const error =
    result.homePriceValue <= 0
      ? "Enter a home price greater than zero."
      : result.downPaymentPercentValue > 100
        ? "Down payment percentage cannot be higher than 100%."
        : "";

  function applyPreset(preset: (typeof presets)[number]) {
    setHomePrice(preset.values.homePrice);
    setTargetDownPaymentPercent(preset.values.targetDownPaymentPercent);
    setClosingCostRate(preset.values.closingCostRate);
    setCurrentSavings(preset.values.currentSavings);
    setMonthlySavings(preset.values.monthlySavings);
    setAnnualReturnRate(preset.values.annualReturnRate);
  }

  return (
    <div className="grid gap-8">
      <ToolInfoBox>
        Estimate how much cash you may need for a down payment and closing
        costs. This calculator is for planning only and does not replace a
        lender estimate, mortgage approval or local closing statement.
      </ToolInfoBox>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total cash target"
          value={formatCurrency(result.totalCashTarget, currency)}
          helper="Down payment plus estimated closing costs"
          isDark
        />

        <SummaryCard
          label="Savings gap"
          value={formatCurrency(result.savingsGap, currency)}
          helper={
            result.savingsGap > 0
              ? "Amount still needed"
              : "Your current savings meet the target"
          }
        />

        <SummaryCard
          label="Estimated time to target"
          value={formatMonths(result.monthsToTarget)}
          helper={`Saving ${formatCurrency(
            result.monthlySavingsValue,
            currency
          )} per month`}
        />
      </section>

      <ToolResultBox title="Down payment inputs">
        <div className="grid gap-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <CurrencySelect value={currency} onChange={setCurrency} />

            <InputField
              label="Home price"
              value={homePrice}
              onChange={setHomePrice}
              prefix={currencySymbols[currency]}
            />

            <InputField
              label="Target down payment"
              value={targetDownPaymentPercent}
              onChange={setTargetDownPaymentPercent}
              suffix="%"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <InputField
              label="Estimated closing costs"
              value={closingCostRate}
              onChange={setClosingCostRate}
              suffix="% of price"
              helper={formatCurrency(result.estimatedClosingCosts, currency)}
            />

            <InputField
              label="Current savings"
              value={currentSavings}
              onChange={setCurrentSavings}
              prefix={currencySymbols[currency]}
            />

            <InputField
              label="Monthly savings"
              value={monthlySavings}
              onChange={setMonthlySavings}
              prefix={currencySymbols[currency]}
            />

            <InputField
              label="Savings return"
              value={annualReturnRate}
              onChange={setAnnualReturnRate}
              suffix="% yearly"
              helper="Optional assumption"
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
            <div className="mb-4">
              <h3 className="text-lg font-black">Quick scenarios</h3>
              <p className="mt-1 text-sm leading-6 text-black/60">
                Use a preset to model different home buying savings plans.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black hover:shadow-sm"
                >
                  <div className="font-black">{preset.name}</div>
                  <div className="mt-1 text-sm leading-6 text-black/55">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ToolResultBox title="Your down payment plan">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-black/50">
                      Savings progress
                    </div>
                    <div className="mt-1 text-2xl font-black">
                      {formatPercent(result.progressPercent)}
                    </div>
                  </div>

                  <div className="text-right text-sm font-bold text-black/55">
                    {formatCurrency(result.currentSavingsValue, currency)} /{" "}
                    {formatCurrency(result.totalCashTarget, currency)}
                  </div>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: `${result.progressPercent}%` }}
                  />
                </div>
              </div>

              <ResultLine
                label="Target down payment"
                value={formatCurrency(result.targetDownPayment, currency)}
              />

              <ResultLine
                label="Estimated closing costs"
                value={formatCurrency(result.estimatedClosingCosts, currency)}
              />

              <ResultLine
                label="Total cash target"
                value={formatCurrency(result.totalCashTarget, currency)}
              />

              <ResultLine
                label="Estimated loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              {result.savingsSurplus > 0 && (
                <div className="rounded-2xl bg-black p-5 text-white">
                  <div className="text-sm font-bold text-white/65">
                    Current savings surplus
                  </div>
                  <div className="mt-2 text-3xl font-black">
                    {formatCurrency(result.savingsSurplus, currency)}
                  </div>
                  <div className="mt-2 text-sm text-white/65">
                    Your current savings are above this cash target.
                  </div>
                </div>
              )}
            </div>
          </ToolResultBox>

          <ToolResultBox title="Savings timeline">
            <div className="grid gap-4">
              <div className="rounded-2xl bg-black p-5 text-white">
                <div className="text-sm font-bold text-white/65">
                  Estimated time to target
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight">
                  {formatMonths(result.monthsToTarget)}
                </div>
                <div className="mt-2 text-sm leading-6 text-white/65">
                  Based on your current savings, monthly savings and optional
                  return assumption.
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric
                  label="Balance in 12 months"
                  value={formatCurrency(result.balanceAfter12Months, currency)}
                />

                <MiniMetric
                  label="Balance in 24 months"
                  value={formatCurrency(result.balanceAfter24Months, currency)}
                />

                <MiniMetric
                  label="Balance in 36 months"
                  value={formatCurrency(result.balanceAfter36Months, currency)}
                />
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
                <h3 className="text-lg font-black">
                  Monthly savings needed without investment returns
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMetric
                    label="12 months"
                    value={formatCurrency(result.monthlyNeeded12, currency)}
                  />

                  <MiniMetric
                    label="24 months"
                    value={formatCurrency(result.monthlyNeeded24, currency)}
                  />

                  <MiniMetric
                    label="36 months"
                    value={formatCurrency(result.monthlyNeeded36, currency)}
                  />
                </div>
              </div>
            </div>
          </ToolResultBox>
        </section>
      )}

      {!error && (
        <ToolResultBox title="Compare down payment targets">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {result.targetOptions.map((option) => (
              <div
                key={option.percent}
                className={
                  option.percent === Math.round(result.downPaymentPercentValue)
                    ? "rounded-2xl border border-black bg-black p-5 text-white"
                    : "rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
                }
              >
                <div
                  className={
                    option.percent === Math.round(result.downPaymentPercentValue)
                      ? "text-sm font-bold text-white/65"
                      : "text-sm font-bold text-black/50"
                  }
                >
                  {option.percent}% down
                </div>

                <div className="mt-2 text-xl font-black">
                  {formatCurrency(option.downPayment, currency)}
                </div>

                <div
                  className={
                    option.percent === Math.round(result.downPaymentPercentValue)
                      ? "mt-3 text-sm leading-6 text-white/65"
                      : "mt-3 text-sm leading-6 text-black/55"
                  }
                >
                  Cash target: {formatCurrency(option.cashTarget, currency)}
                  <br />
                  Gap: {formatCurrency(option.gap, currency)}
                </div>
              </div>
            ))}
          </div>
        </ToolResultBox>
      )}
    </div>
  );
}

function projectSavingsBalance({
  currentSavings,
  monthlySavings,
  annualReturnRate,
  months,
}: {
  currentSavings: number;
  monthlySavings: number;
  annualReturnRate: number;
  months: number;
}) {
  const monthlyReturnRate = Math.max(0, annualReturnRate) / 100 / 12;
  let balance = currentSavings;

  for (let month = 0; month < months; month += 1) {
    balance = balance * (1 + monthlyReturnRate) + monthlySavings;
  }

  return balance;
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (value: Currency) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-black">Currency</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Currency)}
        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none transition focus:border-black"
      >
        {Object.keys(currencySymbols).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  helper?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-black">{label}</span>

      <div className="flex h-12 overflow-hidden rounded-2xl border border-black/10 bg-white transition-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-3 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-3 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>

      {helper && <span className="text-xs font-medium text-black/50">{helper}</span>}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  isDark,
}: {
  label: string;
  value: string;
  helper: string;
  isDark?: boolean;
}) {
  return (
    <div
      className={
        isDark
          ? "rounded-2xl border border-black bg-black p-5 text-white shadow-sm"
          : "rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
      }
    >
      <div
        className={
          isDark
            ? "text-sm font-bold text-white/65"
            : "text-sm font-bold text-black/50"
        }
      >
        {label}
      </div>
      <div className="mt-2 text-3xl font-black tracking-tight">{value}</div>
      <div
        className={
          isDark ? "mt-2 text-sm text-white/60" : "mt-2 text-sm text-black/55"
        }
      >
        {helper}
      </div>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-lg font-black">{value}</div>
    </div>
  );
}