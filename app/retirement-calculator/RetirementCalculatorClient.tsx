"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type YearlyRow = {
  year: number;
  age: number;
  balance: number;
  contributions: number;
  growth: number;
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
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

function calculateRetirement({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentSavings,
  monthlyContribution,
  annualReturn,
  inflationRate,
  desiredMonthlyIncome,
  retirementReturn,
}: {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  inflationRate: number;
  desiredMonthlyIncome: number;
  retirementReturn: number;
}) {
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

  const yearsToRetirement = Math.round(retirementAge - currentAge);
  const retirementYears = Math.round(lifeExpectancy - retirementAge);
  const monthlyGrowthRate = annualReturn / 100 / 12;
  const totalContributionMonths = yearsToRetirement * 12;

  let projectedSavings = currentSavings;
  let totalContributions = currentSavings;

  const yearlyRows: YearlyRow[] = [];

  for (let month = 1; month <= totalContributionMonths; month++) {
    projectedSavings =
      projectedSavings * (1 + monthlyGrowthRate) + monthlyContribution;
    totalContributions += monthlyContribution;

    if (month % 12 === 0 || month === totalContributionMonths) {
      const year = Math.ceil(month / 12);

      yearlyRows.push({
        year,
        age: currentAge + year,
        balance: projectedSavings,
        contributions: totalContributions,
        growth: projectedSavings - totalContributions,
      });
    }
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

  const investmentGrowth = projectedSavings - totalContributions;
  const contributionShare =
    projectedSavings > 0
      ? Math.max(0, Math.min(100, (totalContributions / projectedSavings) * 100))
      : 0;
  const growthShare =
    projectedSavings > 0
      ? Math.max(0, Math.min(100, (investmentGrowth / projectedSavings) * 100))
      : 0;
  const goalProgress =
    requiredNestEgg > 0
      ? Math.max(0, Math.min(100, (projectedSavings / requiredNestEgg) * 100))
      : 100;

  return {
    yearsToRetirement,
    retirementYears,
    projectedSavings,
    requiredNestEgg,
    inflationAdjustedMonthlyIncome,
    gap,
    requiredMonthlyContribution,
    totalContributions,
    investmentGrowth,
    contributionShare,
    growthShare,
    goalProgress,
    yearlyRows,
  };
}

export default function RetirementCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [currentAge, setCurrentAge] = useState("35");
  const [retirementAge, setRetirementAge] = useState("65");
  const [lifeExpectancy, setLifeExpectancy] = useState("90");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContribution, setMonthlyContribution] = useState("600");
  const [annualReturn, setAnnualReturn] = useState("6");
  const [inflationRate, setInflationRate] = useState("2.5");
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState("3500");
  const [retirementReturn, setRetirementReturn] = useState("4");
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      currentAge: parseNumber(currentAge),
      retirementAge: parseNumber(retirementAge),
      lifeExpectancy: parseNumber(lifeExpectancy),
      currentSavings: parseNumber(currentSavings),
      monthlyContribution: parseNumber(monthlyContribution),
      annualReturn: parseNumber(annualReturn),
      inflationRate: parseNumber(inflationRate),
      desiredMonthlyIncome: parseNumber(desiredMonthlyIncome),
      retirementReturn: parseNumber(retirementReturn),
    }),
    [
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      annualReturn,
      inflationRate,
      desiredMonthlyIncome,
      retirementReturn,
    ]
  );

  const result = useMemo(
    () =>
      calculateRetirement({
        currentAge: numericValues.currentAge,
        retirementAge: numericValues.retirementAge,
        lifeExpectancy: numericValues.lifeExpectancy,
        currentSavings: numericValues.currentSavings,
        monthlyContribution: numericValues.monthlyContribution,
        annualReturn: numericValues.annualReturn,
        inflationRate: numericValues.inflationRate,
        desiredMonthlyIncome: numericValues.desiredMonthlyIncome,
        retirementReturn: numericValues.retirementReturn,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (numericValues.currentAge < 0) {
      setError("Current age cannot be negative.");
      return false;
    }

    if (numericValues.retirementAge <= numericValues.currentAge) {
      setError("Retirement age must be higher than current age.");
      return false;
    }

    if (numericValues.lifeExpectancy <= numericValues.retirementAge) {
      setError("Life expectancy must be higher than retirement age.");
      return false;
    }

    if (
      numericValues.currentSavings < 0 ||
      numericValues.monthlyContribution < 0 ||
      numericValues.annualReturn < 0 ||
      numericValues.inflationRate < 0 ||
      numericValues.desiredMonthlyIncome < 0 ||
      numericValues.retirementReturn < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setCurrentAge("35");
    setRetirementAge("65");
    setLifeExpectancy("90");
    setCurrentSavings("50000");
    setMonthlyContribution("600");
    setAnnualReturn("6");
    setInflationRate("2.5");
    setDesiredMonthlyIncome("3500");
    setRetirementReturn("4");
    setShowYearlySummary(false);
    setError("");
  }

  function applyScenario({
    age,
    retireAt,
    life,
    savings,
    contribution,
    returnRate,
    inflation,
    income,
    retirementGrowth,
  }: {
    age: string;
    retireAt: string;
    life: string;
    savings: string;
    contribution: string;
    returnRate: string;
    inflation: string;
    income: string;
    retirementGrowth: string;
  }) {
    setCurrentAge(age);
    setRetirementAge(retireAt);
    setLifeExpectancy(life);
    setCurrentSavings(savings);
    setMonthlyContribution(contribution);
    setAnnualReturn(returnRate);
    setInflationRate(inflation);
    setDesiredMonthlyIncome(income);
    setRetirementReturn(retirementGrowth);
    setShowYearlySummary(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate retirement savings online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how much you may have at retirement, compare it with your
          target income and see whether you are on track for your retirement
          goal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Years to retirement"
          value={result ? `${result.yearsToRetirement} years` : "0 years"}
        />
        <StatCard
          label="Monthly contribution"
          value={formatCurrency(numericValues.monthlyContribution, currency)}
        />
        <StatCard
          label="Goal progress"
          value={result ? formatPercent(result.goalProgress) : "0%"}
        />
      </div>

      <ToolResultBox title="Retirement details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </label>

          <TextNumberInput
            label="Current age"
            value={currentAge}
            onChange={setCurrentAge}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Retirement age"
            value={retirementAge}
            onChange={setRetirementAge}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Life expectancy"
            value={lifeExpectancy}
            onChange={setLifeExpectancy}
            onBlur={validateInputs}
            suffix="years"
          />

          <TextNumberInput
            label="Current savings"
            value={currentSavings}
            onChange={setCurrentSavings}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Monthly contribution"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Expected annual return"
            value={annualReturn}
            onChange={setAnnualReturn}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Inflation rate"
            value={inflationRate}
            onChange={setInflationRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Desired monthly income today"
            value={desiredMonthlyIncome}
            onChange={setDesiredMonthlyIncome}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Return during retirement"
            value={retirementReturn}
            onChange={setRetirementReturn}
            onBlur={validateInputs}
            suffix="%"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              applyScenario({
                age: "35",
                retireAt: "65",
                life: "90",
                savings: "50000",
                contribution: "600",
                returnRate: "6",
                inflation: "2.5",
                income: "3500",
                retirementGrowth: "4",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Balanced plan
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                age: "30",
                retireAt: "67",
                life: "92",
                savings: "25000",
                contribution: "800",
                returnRate: "7",
                inflation: "2.5",
                income: "4000",
                retirementGrowth: "4",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Early starter
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                age: "50",
                retireAt: "67",
                life: "90",
                savings: "180000",
                contribution: "1200",
                returnRate: "5",
                inflation: "2.5",
                income: "4500",
                retirementGrowth: "3.5",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Catch-up plan
          </button>

          <button
            type="button"
            onClick={resetExample}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Reset example
          </button>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <>
          <ToolResultBox title="Retirement estimate">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                positive={result.gap >= 0}
              />

              <ResultCard
                label="Required monthly contribution"
                value={formatCurrency(
                  result.requiredMonthlyContribution,
                  currency
                )}
              />

              <ResultCard
                label="Inflation-adjusted income"
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

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              At retirement, your projected savings are{" "}
              <strong className="text-black">
                {formatCurrency(result.projectedSavings, currency)}
              </strong>
              . Your estimated required nest egg is{" "}
              <strong className="text-black">
                {formatCurrency(result.requiredNestEgg, currency)}
              </strong>
              . Your estimated gap or surplus is{" "}
              <strong className="text-black">
                {formatCurrency(result.gap, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Retirement funding breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Total contributions"
                percentage={result.contributionShare}
                formattedValue={formatCurrency(
                  result.totalContributions,
                  currency
                )}
              />

              <BreakdownBar
                label="Investment growth"
                percentage={result.growthShare}
                formattedValue={formatCurrency(result.investmentGrowth, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-black text-black">
                    Goal progress
                  </div>

                  <div className="mt-1 text-xs text-black/50">
                    Projected savings compared with required nest egg
                  </div>
                </div>

                <div className="text-right text-sm font-black text-black">
                  {formatPercent(result.goalProgress)}
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-black"
                  style={{ width: `${result.goalProgress}%` }}
                />
              </div>
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Yearly savings summary"
            description="Show estimated retirement savings, contributions and investment growth by year."
            open={showYearlySummary}
            onToggle={() => setShowYearlySummary((current) => !current)}
          >
            <div className="grid gap-3">
              {result.yearlyRows.map((row) => (
                <div
                  key={row.year}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-black text-black">
                        Year {row.year} · Age {row.age}
                      </div>

                      <div className="mt-1 text-xs text-black/50">
                        Contributions:{" "}
                        {formatCurrency(row.contributions, currency)} · Growth:{" "}
                        {formatCurrency(row.growth, currency)}
                      </div>
                    </div>

                    <div className="text-right text-sm font-black text-black">
                      {formatCurrency(row.balance, currency)}
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (row.balance / result.projectedSavings) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TogglePanel>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid retirement assumptions to calculate your projected savings
          and retirement gap.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator is for planning estimates only. It does not account for
        taxes, pension systems, healthcare costs, local retirement rules,
        withdrawals, account limits or market volatility.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-black">{value}</div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
  positive,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
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

      <div
        className={`mt-2 text-xl font-black ${
          positive === false && !highlight ? "text-red-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  percentage,
  formattedValue,
}: {
  label: string;
  percentage: number;
  formattedValue: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {percentage.toFixed(1)}% of projected savings
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-black">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-black/5"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}