"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ContributionFrequency = "monthly" | "quarterly" | "yearly";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function getFrequencyMultiplier(frequency: ContributionFrequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

export default function SavingsCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [startingBalance, setStartingBalance] = useState(5000);
  const [regularContribution, setRegularContribution] = useState(250);
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [annualInterestRate, setAnnualInterestRate] = useState(4.5);
  const [years, setYears] = useState(10);
  const [taxRate, setTaxRate] = useState(0);
  const [inflationRate, setInflationRate] = useState(2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      startingBalance < 0 ||
      regularContribution < 0 ||
      annualInterestRate < 0 ||
      years <= 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      inflationRate < 0
    ) {
      return null;
    }

    const periodsPerYear = getFrequencyMultiplier(contributionFrequency);
    const totalPeriods = years * periodsPerYear;
    const periodicRate = annualInterestRate / 100 / periodsPerYear;

    let balance = startingBalance;
    let totalContributions = startingBalance;
    let totalInterest = 0;

    for (let period = 0; period < totalPeriods; period++) {
      const interest = balance * periodicRate;
      totalInterest += interest;
      balance += interest + regularContribution;
      totalContributions += regularContribution;
    }

    const estimatedTax = totalInterest * (taxRate / 100);
    const afterTaxBalance = balance - estimatedTax;
    const realValue =
      afterTaxBalance / Math.pow(1 + inflationRate / 100, years);

    return {
      finalBalance: balance,
      afterTaxBalance,
      realValue,
      totalContributions,
      totalInterest,
      estimatedTax,
      growthOnly: balance - totalContributions,
    };
  }, [
    startingBalance,
    regularContribution,
    contributionFrequency,
    annualInterestRate,
    years,
    taxRate,
    inflationRate,
  ]);

  function validateInputs() {
    if (startingBalance < 0 || regularContribution < 0) {
      setError("Starting balance and contribution cannot be negative.");
      return false;
    }

    if (annualInterestRate < 0 || inflationRate < 0) {
      setError("Interest rate and inflation rate cannot be negative.");
      return false;
    }

    if (years <= 0) {
      setError("Savings period must be greater than zero.");
      return false;
    }

    if (taxRate < 0 || taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setStartingBalance(5000);
    setRegularContribution(250);
    setContributionFrequency("monthly");
    setAnnualInterestRate(4.5);
    setYears(10);
    setTaxRate(0);
    setInflationRate(2);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate savings growth
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how your savings can grow over time with recurring
          contributions, interest, tax assumptions and inflation adjustment.
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
          <NumberInput
            label="Starting balance"
            value={startingBalance}
            onChange={setStartingBalance}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Regular contribution"
            value={regularContribution}
            onChange={setRegularContribution}
            onBlur={validateInputs}
          />

          <label className="block">
            <span className="text-sm font-bold text-black">
              Contribution frequency
            </span>

            <select
              value={contributionFrequency}
              onChange={(event) =>
                setContributionFrequency(
                  event.target.value as ContributionFrequency
                )
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>

          <NumberInput
            label="Annual interest rate %"
            value={annualInterestRate}
            onChange={setAnnualInterestRate}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Years"
            value={years}
            onChange={setYears}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Tax rate on interest %"
            value={taxRate}
            onChange={setTaxRate}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Inflation rate %"
            value={inflationRate}
            onChange={setInflationRate}
            onBlur={validateInputs}
          />
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
        <ToolResultBox title="Savings estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Final balance"
              value={formatCurrency(result.finalBalance, currency)}
              highlight
            />

            <ResultCard
              label="After-tax balance"
              value={formatCurrency(result.afterTaxBalance, currency)}
            />

            <ResultCard
              label="Inflation-adjusted value"
              value={formatCurrency(result.realValue, currency)}
            />

            <ResultCard
              label="Total contributions"
              value={formatCurrency(result.totalContributions, currency)}
            />

            <ResultCard
              label="Interest earned"
              value={formatCurrency(result.totalInterest, currency)}
            />

            <ResultCard
              label="Estimated tax"
              value={formatCurrency(result.estimatedTax, currency)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            After {years} years, your estimated savings balance is{" "}
            <strong className="text-black">
              {formatCurrency(result.finalBalance, currency)}
            </strong>
            . Adjust tax and inflation assumptions for a more realistic
            long-term estimate.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid savings values to calculate future growth.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This savings calculator is for estimates only. Actual results can vary
        based on account terms, taxes, fees, inflation and local rules.
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