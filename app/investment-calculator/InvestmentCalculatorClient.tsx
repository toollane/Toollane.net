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

function getPeriodsPerYear(frequency: ContributionFrequency) {
  if (frequency === "monthly") return 12;
  if (frequency === "quarterly") return 4;
  return 1;
}

export default function InvestmentCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [regularContribution, setRegularContribution] = useState(300);
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [expenseRatio, setExpenseRatio] = useState(0.2);
  const [taxRate, setTaxRate] = useState(0);
  const [inflationRate, setInflationRate] = useState(2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      initialInvestment < 0 ||
      regularContribution < 0 ||
      annualReturn < 0 ||
      years <= 0 ||
      expenseRatio < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      inflationRate < 0
    ) {
      return null;
    }

    const periodsPerYear = getPeriodsPerYear(contributionFrequency);
    const totalPeriods = years * periodsPerYear;
    const netAnnualReturn = Math.max(0, annualReturn - expenseRatio);
    const periodicRate = netAnnualReturn / 100 / periodsPerYear;

    let balance = initialInvestment;
    let totalContributions = initialInvestment;

    for (let period = 0; period < totalPeriods; period++) {
      balance = balance * (1 + periodicRate) + regularContribution;
      totalContributions += regularContribution;
    }

    const investmentGain = balance - totalContributions;
    const estimatedTax = investmentGain > 0 ? investmentGain * (taxRate / 100) : 0;
    const afterTaxValue = balance - estimatedTax;
    const inflationAdjustedValue =
      afterTaxValue / Math.pow(1 + inflationRate / 100, years);

    return {
      finalValue: balance,
      afterTaxValue,
      inflationAdjustedValue,
      totalContributions,
      investmentGain,
      estimatedTax,
      netAnnualReturn,
    };
  }, [
    initialInvestment,
    regularContribution,
    contributionFrequency,
    annualReturn,
    years,
    expenseRatio,
    taxRate,
    inflationRate,
  ]);

  function validateInputs() {
    if (initialInvestment < 0 || regularContribution < 0) {
      setError("Investment and contribution values cannot be negative.");
      return false;
    }

    if (annualReturn < 0 || expenseRatio < 0 || inflationRate < 0) {
      setError("Return, fees and inflation cannot be negative.");
      return false;
    }

    if (years <= 0) {
      setError("Investment period must be greater than zero.");
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
    setInitialInvestment(10000);
    setRegularContribution(300);
    setContributionFrequency("monthly");
    setAnnualReturn(7);
    setYears(20);
    setExpenseRatio(0.2);
    setTaxRate(0);
    setInflationRate(2);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate investment growth
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate long-term investment growth with contributions, expected
          return, fees, taxes and inflation.
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
          <NumberInput label="Initial investment" value={initialInvestment} onChange={setInitialInvestment} onBlur={validateInputs} />
          <NumberInput label="Regular contribution" value={regularContribution} onChange={setRegularContribution} onBlur={validateInputs} />

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

          <NumberInput label="Expected annual return %" value={annualReturn} onChange={setAnnualReturn} onBlur={validateInputs} />
          <NumberInput label="Investment period years" value={years} onChange={setYears} onBlur={validateInputs} />
          <NumberInput label="Annual fees / expense ratio %" value={expenseRatio} onChange={setExpenseRatio} onBlur={validateInputs} />
          <NumberInput label="Tax rate on gains %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
          <NumberInput label="Inflation rate %" value={inflationRate} onChange={setInflationRate} onBlur={validateInputs} />
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
        <ToolResultBox title="Investment estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Final value"
              value={formatCurrency(result.finalValue, currency)}
              highlight
            />

            <ResultCard
              label="After-tax value"
              value={formatCurrency(result.afterTaxValue, currency)}
            />

            <ResultCard
              label="Inflation-adjusted value"
              value={formatCurrency(result.inflationAdjustedValue, currency)}
            />

            <ResultCard
              label="Total contributions"
              value={formatCurrency(result.totalContributions, currency)}
            />

            <ResultCard
              label="Investment gain"
              value={formatCurrency(result.investmentGain, currency)}
            />

            <ResultCard
              label="Estimated tax"
              value={formatCurrency(result.estimatedTax, currency)}
            />

            <ResultCard
              label="Net annual return"
              value={`${result.netAnnualReturn.toFixed(2)}%`}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            After {years} years, your estimated investment value is{" "}
            <strong className="text-black">
              {formatCurrency(result.finalValue, currency)}
            </strong>
            . After tax and inflation assumptions, the estimated real value is{" "}
            <strong className="text-black">
              {formatCurrency(result.inflationAdjustedValue, currency)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid investment details to calculate projected growth.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual investment results can
        vary due to market risk, taxes, inflation, fees and timing of
        contributions.
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