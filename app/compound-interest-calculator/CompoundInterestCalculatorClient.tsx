"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Frequency = "monthly" | "quarterly" | "yearly";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getContributionsPerYear(frequency: Frequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

export default function CompoundInterestCalculatorClient() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(250);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    setError("");

    if (principal < 0 || monthlyContribution < 0 || annualRate < 0 || years <= 0) {
      return null;
    }

    const periodsPerYear = getContributionsPerYear(frequency);
    const totalPeriods = years * periodsPerYear;
    const periodicRate = annualRate / 100 / periodsPerYear;
    const contributionPerPeriod =
      frequency === "monthly"
        ? monthlyContribution
        : frequency === "quarterly"
          ? monthlyContribution * 3
          : monthlyContribution * 12;

    let balance = principal;

    for (let period = 0; period < totalPeriods; period++) {
      balance = balance * (1 + periodicRate) + contributionPerPeriod;
    }

    const totalContributions = principal + contributionPerPeriod * totalPeriods;
    const interestEarned = balance - totalContributions;

    return {
      finalBalance: balance,
      totalContributions,
      interestEarned,
    };
  }, [principal, monthlyContribution, annualRate, years, frequency]);

  function resetExample() {
    setPrincipal(10000);
    setMonthlyContribution(250);
    setAnnualRate(7);
    setYears(20);
    setFrequency("monthly");
    setError("");
  }

  function validateInputs() {
    if (principal < 0) {
      setError("Initial amount cannot be negative.");
      return false;
    }

    if (monthlyContribution < 0) {
      setError("Contribution cannot be negative.");
      return false;
    }

    if (annualRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (years <= 0) {
      setError("Years must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate compound interest
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how your savings or investments can grow over time with
          compound interest and recurring contributions.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">
              Initial amount
            </span>

            <input
              type="number"
              value={principal}
              onChange={(event) => {
                setPrincipal(Number(event.target.value));
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Monthly contribution
            </span>

            <input
              type="number"
              value={monthlyContribution}
              onChange={(event) => {
                setMonthlyContribution(Number(event.target.value));
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Annual return rate %
            </span>

            <input
              type="number"
              value={annualRate}
              onChange={(event) => {
                setAnnualRate(Number(event.target.value));
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">
              Years
            </span>

            <input
              type="number"
              value={years}
              onChange={(event) => {
                setYears(Number(event.target.value));
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Contribution frequency
          </span>

          <select
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as Frequency)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

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
        <ToolResultBox title="Investment result">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Final balance
              </div>

              <div className="mt-2 text-xl font-black text-black">
                {formatCurrency(result.finalBalance)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Contributions
              </div>

              <div className="mt-2 text-xl font-black text-black">
                {formatCurrency(result.totalContributions)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Interest earned
              </div>

              <div className="mt-2 text-xl font-black text-black">
                {formatCurrency(result.interestEarned)}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            After {years} years, your estimated balance is{" "}
            <strong className="text-black">
              {formatCurrency(result.finalBalance)}
            </strong>
            . This includes{" "}
            <strong className="text-black">
              {formatCurrency(result.interestEarned)}
            </strong>{" "}
            in estimated compound interest.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter positive values to calculate compound growth over time.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides an estimate only. Actual investment returns can
        vary and may include fees, taxes, inflation and market risk.
      </ToolInfoBox>
    </div>
  );
}