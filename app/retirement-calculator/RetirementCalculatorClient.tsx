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

export default function RetirementCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(90);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(600);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(3500);
  const [retirementReturn, setRetirementReturn] = useState(4);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      currentAge < 0 ||
      retirementAge <= currentAge ||
      lifeExpectancy <= retirementAge ||
      currentSavings < 0 ||
      monthlyContribution < 0 ||
      annualReturn < 0 ||
      inflationRate < 0 ||
      desiredMonthlyIncome < 0 ||
      retirementReturn < 0
    ) {
      return null;
    }

    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = lifeExpectancy - retirementAge;
    const monthlyGrowthRate = annualReturn / 100 / 12;
    const totalContributionMonths = yearsToRetirement * 12;

    let projectedSavings = currentSavings;

    for (let month = 0; month < totalContributionMonths; month++) {
      projectedSavings =
        projectedSavings * (1 + monthlyGrowthRate) + monthlyContribution;
    }

    const inflationAdjustedMonthlyIncome =
      desiredMonthlyIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    const retirementMonthlyRate = retirementReturn / 100 / 12;
    const retirementMonths = retirementYears * 12;

    const requiredNestEgg =
      retirementMonthlyRate === 0
        ? inflationAdjustedMonthlyIncome * retirementMonths
        : (inflationAdjustedMonthlyIncome *
            (1 - Math.pow(1 + retirementMonthlyRate, -retirementMonths))) /
          retirementMonthlyRate;

    const gap = projectedSavings - requiredNestEgg;

    const requiredMonthlyContribution = calculateRequiredMonthlyContribution({
      currentSavings,
      requiredNestEgg,
      months: totalContributionMonths,
      monthlyRate: monthlyGrowthRate,
    });

    return {
      yearsToRetirement,
      retirementYears,
      projectedSavings,
      requiredNestEgg,
      inflationAdjustedMonthlyIncome,
      gap,
      requiredMonthlyContribution,
      totalContributions:
        currentSavings + monthlyContribution * totalContributionMonths,
      investmentGrowth:
        projectedSavings -
        (currentSavings + monthlyContribution * totalContributionMonths),
    };
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturn,
    inflationRate,
    desiredMonthlyIncome,
    retirementReturn,
  ]);

  function validateInputs() {
    if (retirementAge <= currentAge) {
      setError("Retirement age must be higher than current age.");
      return false;
    }

    if (lifeExpectancy <= retirementAge) {
      setError("Life expectancy must be higher than retirement age.");
      return false;
    }

    if (
      currentSavings < 0 ||
      monthlyContribution < 0 ||
      annualReturn < 0 ||
      inflationRate < 0 ||
      desiredMonthlyIncome < 0 ||
      retirementReturn < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setCurrentAge(35);
    setRetirementAge(65);
    setLifeExpectancy(90);
    setCurrentSavings(50000);
    setMonthlyContribution(600);
    setAnnualReturn(6);
    setInflationRate(2.5);
    setDesiredMonthlyIncome(3500);
    setRetirementReturn(4);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate retirement savings
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how much you may have at retirement and compare it with your
          desired retirement income goal.
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
          <NumberInput label="Current age" value={currentAge} onChange={setCurrentAge} onBlur={validateInputs} />
          <NumberInput label="Retirement age" value={retirementAge} onChange={setRetirementAge} onBlur={validateInputs} />
          <NumberInput label="Life expectancy" value={lifeExpectancy} onChange={setLifeExpectancy} onBlur={validateInputs} />
          <NumberInput label="Current savings" value={currentSavings} onChange={setCurrentSavings} onBlur={validateInputs} />
          <NumberInput label="Monthly contribution" value={monthlyContribution} onChange={setMonthlyContribution} onBlur={validateInputs} />
          <NumberInput label="Expected annual return %" value={annualReturn} onChange={setAnnualReturn} onBlur={validateInputs} />
          <NumberInput label="Inflation rate %" value={inflationRate} onChange={setInflationRate} onBlur={validateInputs} />
          <NumberInput label="Desired monthly income today" value={desiredMonthlyIncome} onChange={setDesiredMonthlyIncome} onBlur={validateInputs} />
          <NumberInput label="Return during retirement %" value={retirementReturn} onChange={setRetirementReturn} onBlur={validateInputs} />
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
        <ToolResultBox title="Retirement estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Projected savings"
              value={formatCurrency(result.projectedSavings, currency)}
              highlight
            />

            <ResultCard
              label="Required nest egg"
              value={formatCurrency(result.requiredNestEgg, currency)}
            />

            <ResultCard
              label="Surplus / gap"
              value={formatCurrency(result.gap, currency)}
            />

            <ResultCard
              label="Required monthly contribution"
              value={formatCurrency(result.requiredMonthlyContribution, currency)}
            />

            <ResultCard
              label="Inflation-adjusted monthly income"
              value={formatCurrency(
                result.inflationAdjustedMonthlyIncome,
                currency
              )}
            />

            <ResultCard
              label="Investment growth"
              value={formatCurrency(result.investmentGrowth, currency)}
            />

            <ResultCard
              label="Years to retirement"
              value={`${result.yearsToRetirement} years`}
            />

            <ResultCard
              label="Retirement duration"
              value={`${result.retirementYears} years`}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            At retirement, your projected savings are{" "}
            <strong className="text-black">
              {formatCurrency(result.projectedSavings, currency)}
            </strong>
            . Your estimated required nest egg is{" "}
            <strong className="text-black">
              {formatCurrency(result.requiredNestEgg, currency)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid retirement assumptions to calculate your projected savings
          and retirement gap.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator is for planning estimates only. It does not account for
        taxes, pension systems, healthcare costs, local retirement rules or
        market volatility.
      </ToolInfoBox>
    </div>
  );
}

function calculateRequiredMonthlyContribution({
  currentSavings,
  requiredNestEgg,
  months,
  monthlyRate,
}: {
  currentSavings: number;
  requiredNestEgg: number;
  months: number;
  monthlyRate: number;
}) {
  if (months <= 0) return 0;

  const futureValueOfCurrentSavings =
    currentSavings * Math.pow(1 + monthlyRate, months);

  const remainingGoal = Math.max(0, requiredNestEgg - futureValueOfCurrentSavings);

  if (remainingGoal <= 0) return 0;

  if (monthlyRate === 0) {
    return remainingGoal / months;
  }

  return (
    remainingGoal *
    (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1))
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