"use client";

import type { ReactNode } from "react";
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

type MortgageOptionInput = {
  id: string;
  name: string;
  interestRate: string;
  termYears: string;
  upfrontCosts: string;
  monthlyCosts: string;
};

type MortgageOptionResult = {
  id: string;
  name: string;
  interestRate: number;
  termYears: number;
  upfrontCosts: number;
  monthlyCosts: number;
  termMonths: number;
  monthlyPayment: number;
  totalMonthlyPayment: number;
  totalInterestFullTerm: number;
  totalCashOutflowFullTerm: number;
  ownershipMonths: number;
  remainingBalanceAfterOwnership: number;
  principalPaidDuringOwnership: number;
  interestPaidDuringOwnership: number;
  cashOutflowDuringOwnership: number;
  financingCostDuringOwnership: number;
};

type Scenario = {
  name: string;
  description: string;
  purchasePrice: string;
  downPaymentPercent: string;
  ownershipYears: string;
  options: MortgageOptionInput[];
};

const currencyOptions: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "CHF", label: "CHF — Swiss Franc" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const defaultOptions: MortgageOptionInput[] = [
  {
    id: "option-a",
    name: "Option A",
    interestRate: "6.25",
    termYears: "30",
    upfrontCosts: "6000",
    monthlyCosts: "0",
  },
  {
    id: "option-b",
    name: "Option B",
    interestRate: "6.75",
    termYears: "30",
    upfrontCosts: "1000",
    monthlyCosts: "0",
  },
  {
    id: "option-c",
    name: "Option C",
    interestRate: "6.5",
    termYears: "30",
    upfrontCosts: "3000",
    monthlyCosts: "0",
  },
];

const scenarios: Scenario[] = [
  {
    name: "Lower rate vs lower fees",
    description: "Compare a lower rate with higher upfront costs.",
    purchasePrice: "450000",
    downPaymentPercent: "20",
    ownershipYears: "7",
    options: [
      {
        id: "option-a",
        name: "Lower rate",
        interestRate: "6.25",
        termYears: "30",
        upfrontCosts: "6000",
        monthlyCosts: "0",
      },
      {
        id: "option-b",
        name: "Lower fees",
        interestRate: "6.75",
        termYears: "30",
        upfrontCosts: "1000",
        monthlyCosts: "0",
      },
      {
        id: "option-c",
        name: "Middle offer",
        interestRate: "6.5",
        termYears: "30",
        upfrontCosts: "3000",
        monthlyCosts: "0",
      },
    ],
  },
  {
    name: "15 vs 30 years",
    description: "Compare shorter and longer mortgage terms.",
    purchasePrice: "400000",
    downPaymentPercent: "20",
    ownershipYears: "10",
    options: [
      {
        id: "option-a",
        name: "30-year fixed",
        interestRate: "6.5",
        termYears: "30",
        upfrontCosts: "3000",
        monthlyCosts: "0",
      },
      {
        id: "option-b",
        name: "15-year fixed",
        interestRate: "6.1",
        termYears: "15",
        upfrontCosts: "3500",
        monthlyCosts: "0",
      },
      {
        id: "option-c",
        name: "20-year fixed",
        interestRate: "6.25",
        termYears: "20",
        upfrontCosts: "3250",
        monthlyCosts: "0",
      },
    ],
  },
  {
    name: "Short ownership",
    description: "See how fees matter when you sell or refinance sooner.",
    purchasePrice: "500000",
    downPaymentPercent: "20",
    ownershipYears: "4",
    options: [
      {
        id: "option-a",
        name: "Discount points",
        interestRate: "6.1",
        termYears: "30",
        upfrontCosts: "9000",
        monthlyCosts: "0",
      },
      {
        id: "option-b",
        name: "No points",
        interestRate: "6.7",
        termYears: "30",
        upfrontCosts: "1500",
        monthlyCosts: "0",
      },
      {
        id: "option-c",
        name: "Standard offer",
        interestRate: "6.45",
        termYears: "30",
        upfrontCosts: "4000",
        monthlyCosts: "0",
      },
    ],
  },
  {
    name: "Monthly add-ons",
    description: "Include monthly PMI, fees or lender-related add-ons.",
    purchasePrice: "350000",
    downPaymentPercent: "10",
    ownershipYears: "8",
    options: [
      {
        id: "option-a",
        name: "Lower rate plus PMI",
        interestRate: "6.35",
        termYears: "30",
        upfrontCosts: "3500",
        monthlyCosts: "120",
      },
      {
        id: "option-b",
        name: "Higher rate no PMI",
        interestRate: "6.85",
        termYears: "30",
        upfrontCosts: "2000",
        monthlyCosts: "0",
      },
      {
        id: "option-c",
        name: "Middle option",
        interestRate: "6.6",
        termYears: "30",
        upfrontCosts: "2750",
        monthlyCosts: "60",
      },
    ],
  },
];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  const symbol = currencySymbols[currency];

  if (!Number.isFinite(value)) {
    return `${symbol}0`;
  }

  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  if (currency === "JPY") {
    return `${sign}${symbol}${Math.round(absoluteValue).toLocaleString(
      "en-US"
    )}`;
  }

  return `${sign}${symbol}${absoluteValue.toLocaleString("en-US", {
    maximumFractionDigits: absoluteValue >= 1000 ? 0 : 2,
    minimumFractionDigits: absoluteValue >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0.00%";
  }

  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}%`;
}

function formatDuration(months: number | null) {
  if (months === null || !Number.isFinite(months)) {
    return "—";
  }

  const roundedMonths = Math.max(0, Math.round(months));
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;

  if (years <= 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${years} years`;
  }

  return `${years} years ${remainingMonths} months`;
}

function getMonthlyPayment({
  loanAmount,
  annualRate,
  termYears,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
}) {
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function getRemainingBalance({
  loanAmount,
  annualRate,
  termYears,
  monthsElapsed,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  monthsElapsed: number;
}) {
  const termMonths = Math.max(1, Math.round(termYears * 12));
  const months = Math.min(Math.max(0, Math.round(monthsElapsed)), termMonths);
  const monthlyRate = annualRate / 100 / 12;
  const payment = getMonthlyPayment({ loanAmount, annualRate, termYears });

  if (loanAmount <= 0) {
    return 0;
  }

  if (months >= termMonths) {
    return 0;
  }

  if (monthlyRate === 0) {
    return Math.max(0, loanAmount - payment * months);
  }

  const balance =
    loanAmount * Math.pow(1 + monthlyRate, months) -
    payment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return Math.max(0, balance);
}

function getBreakEvenMonths(
  optionA: MortgageOptionResult,
  optionB: MortgageOptionResult
) {
  const monthlyDifference =
    optionA.totalMonthlyPayment - optionB.totalMonthlyPayment;

  const upfrontDifference = optionB.upfrontCosts - optionA.upfrontCosts;

  if (monthlyDifference === 0) {
    return null;
  }

  const months = upfrontDifference / monthlyDifference;

  if (!Number.isFinite(months) || months <= 0) {
    return null;
  }

  return months;
}

function getComparisonLabel({
  bestOption,
  savingsVsMostExpensive,
}: {
  bestOption: MortgageOptionResult;
  savingsVsMostExpensive: number;
}) {
  if (savingsVsMostExpensive <= 0) {
    return {
      label: "Very close comparison",
      description:
        "The mortgage options are estimated to be very close based on the current inputs.",
    };
  }

  if (savingsVsMostExpensive >= 25000) {
    return {
      label: `${bestOption.name} looks significantly cheaper`,
      description:
        "The estimated cost difference is large over your selected ownership period. Review the assumptions carefully before choosing.",
    };
  }

  if (savingsVsMostExpensive >= 10000) {
    return {
      label: `${bestOption.name} has a meaningful estimated advantage`,
      description:
        "The best estimated option could save a meaningful amount over your selected ownership period.",
    };
  }

  return {
    label: `${bestOption.name} has a modest estimated advantage`,
    description:
      "The estimated difference is modest, so flexibility, lender terms and closing requirements may matter more.",
  };
}

export default function MortgageComparisonCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [purchasePrice, setPurchasePrice] = useState("450000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [ownershipYears, setOwnershipYears] = useState("7");
  const [mortgageOptions, setMortgageOptions] =
    useState<MortgageOptionInput[]>(defaultOptions);

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const price = parseNumber(purchasePrice);
    const downPaymentRate = parseNumber(downPaymentPercent);
    const plannedOwnershipYears = parseNumber(ownershipYears);

    const downPaymentAmount = price * (downPaymentRate / 100);
    const loanAmount = Math.max(0, price - downPaymentAmount);
    const ownershipMonths = Math.max(1, Math.round(plannedOwnershipYears * 12));

    const optionResults: MortgageOptionResult[] = mortgageOptions.map(
      (option) => {
        const interestRate = parseNumber(option.interestRate);
        const termYears = parseNumber(option.termYears);
        const upfrontCosts = parseNumber(option.upfrontCosts);
        const monthlyCosts = parseNumber(option.monthlyCosts);

        const termMonths = Math.max(1, Math.round(termYears * 12));
        const monthsInComparison = Math.min(ownershipMonths, termMonths);

        const monthlyPayment = getMonthlyPayment({
          loanAmount,
          annualRate: interestRate,
          termYears,
        });

        const totalMonthlyPayment = monthlyPayment + monthlyCosts;

        const remainingBalanceAfterOwnership = getRemainingBalance({
          loanAmount,
          annualRate: interestRate,
          termYears,
          monthsElapsed: monthsInComparison,
        });

        const principalPaidDuringOwnership =
          loanAmount - remainingBalanceAfterOwnership;

        const interestPaidDuringOwnership =
          monthlyPayment * monthsInComparison - principalPaidDuringOwnership;

        const cashOutflowDuringOwnership =
          totalMonthlyPayment * monthsInComparison + upfrontCosts;

        const financingCostDuringOwnership =
          interestPaidDuringOwnership +
          monthlyCosts * monthsInComparison +
          upfrontCosts;

        const totalInterestFullTerm = monthlyPayment * termMonths - loanAmount;

        const totalCashOutflowFullTerm =
          totalMonthlyPayment * termMonths + upfrontCosts;

        return {
          id: option.id,
          name: option.name.trim() || "Mortgage option",
          interestRate,
          termYears,
          upfrontCosts,
          monthlyCosts,
          termMonths,
          monthlyPayment,
          totalMonthlyPayment,
          totalInterestFullTerm,
          totalCashOutflowFullTerm,
          ownershipMonths: monthsInComparison,
          remainingBalanceAfterOwnership,
          principalPaidDuringOwnership,
          interestPaidDuringOwnership,
          cashOutflowDuringOwnership,
          financingCostDuringOwnership,
        };
      }
    );

    const sortedByOwnershipCost = [...optionResults].sort(
      (a, b) => a.financingCostDuringOwnership - b.financingCostDuringOwnership
    );

    const sortedByMonthlyPayment = [...optionResults].sort(
      (a, b) => a.totalMonthlyPayment - b.totalMonthlyPayment
    );

    const sortedByFullTermInterest = [...optionResults].sort(
      (a, b) => a.totalInterestFullTerm - b.totalInterestFullTerm
    );

    const bestOption = sortedByOwnershipCost[0];
    const mostExpensiveOption =
      sortedByOwnershipCost[sortedByOwnershipCost.length - 1];

    const lowestMonthlyOption = sortedByMonthlyPayment[0];
    const lowestInterestOption = sortedByFullTermInterest[0];

    const savingsVsMostExpensive =
      mostExpensiveOption.financingCostDuringOwnership -
      bestOption.financingCostDuringOwnership;

    const breakEvenMonths = getBreakEvenMonths(optionResults[0], optionResults[1]);

    const health = getComparisonLabel({
      bestOption,
      savingsVsMostExpensive,
    });

    return {
      price,
      downPaymentRate,
      plannedOwnershipYears,
      downPaymentAmount,
      loanAmount,
      ownershipMonths,
      optionResults,
      bestOption,
      mostExpensiveOption,
      lowestMonthlyOption,
      lowestInterestOption,
      savingsVsMostExpensive,
      breakEvenMonths,
      health,
    };
  }, [purchasePrice, downPaymentPercent, ownershipYears, mortgageOptions]);

  function validateInputs() {
    if (result.price <= 0) {
      setError("Purchase price must be greater than zero.");
      return false;
    }

    if (result.downPaymentRate < 0 || result.downPaymentRate > 100) {
      setError("Down payment must be between 0% and 100%.");
      return false;
    }

    if (result.loanAmount <= 0) {
      setError("Loan amount must be greater than zero. Reduce the down payment percentage.");
      return false;
    }

    if (result.plannedOwnershipYears <= 0) {
      setError("Expected ownership period must be greater than zero.");
      return false;
    }

    for (const option of mortgageOptions) {
      const interestRate = parseNumber(option.interestRate);
      const termYears = parseNumber(option.termYears);
      const upfrontCosts = parseNumber(option.upfrontCosts);
      const monthlyCosts = parseNumber(option.monthlyCosts);

      if (interestRate < 0) {
        setError(`${option.name || "Mortgage option"} has a negative interest rate.`);
        return false;
      }

      if (termYears <= 0 || termYears > 50) {
        setError(`${option.name || "Mortgage option"} must have a loan term between 1 and 50 years.`);
        return false;
      }

      if (upfrontCosts < 0 || monthlyCosts < 0) {
        setError(`${option.name || "Mortgage option"} cannot have negative costs.`);
        return false;
      }
    }

    setError("");
    return true;
  }

  function updateOption(
    id: string,
    field: keyof Omit<MortgageOptionInput, "id">,
    value: string
  ) {
    setMortgageOptions((currentOptions) =>
      currentOptions.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );

    setError("");
  }

  function applyScenario(scenario: Scenario) {
    setPurchasePrice(scenario.purchasePrice);
    setDownPaymentPercent(scenario.downPaymentPercent);
    setOwnershipYears(scenario.ownershipYears);
    setMortgageOptions(scenario.options);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compare mortgage offers
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Compare mortgage options by monthly payment, interest rate, upfront
          costs, full-term interest and estimated financing cost over your
          expected ownership period.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Best estimated option"
          value={result.bestOption.name}
          highlight
        />

        <StatCard
          label="Estimated savings"
          value={formatCurrency(result.savingsVsMostExpensive, currency)}
        />

        <StatCard
          label="Lowest monthly payment"
          value={result.lowestMonthlyOption.name}
        />
      </div>

      <ToolResultBox title="Home and comparison inputs">
        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <MoneyInput
              label="Purchase price"
              value={purchasePrice}
              onChange={setPurchasePrice}
              currency={currency}
              helper="Estimated home purchase price."
            />

            <PercentInput
              label="Down payment"
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
              helper="Percentage paid upfront."
            />

            <NumberInput
              label="Expected ownership"
              value={ownershipYears}
              onChange={setOwnershipYears}
              suffix="years"
              helper="How long you expect to keep this mortgage or home."
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-4">
            <div className="text-sm font-black text-black">
              Estimated loan amount
            </div>

            <p className="mt-2 text-2xl font-black text-black">
              {formatCurrency(result.loanAmount, currency)}
            </p>

            <p className="mt-2 text-xs leading-5 text-black/60">
              Based on a down payment of{" "}
              <strong>{formatCurrency(result.downPaymentAmount, currency)}</strong>{" "}
              and a purchase price of{" "}
              <strong>{formatCurrency(result.price, currency)}</strong>.
            </p>
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Mortgage options">
        <div className="grid gap-4 lg:grid-cols-3">
          {mortgageOptions.map((option) => (
            <MortgageOptionCard
              key={option.id}
              option={option}
              currency={currency}
              onChange={updateOption}
            />
          ))}
        </div>
      </ToolResultBox>

      <ToolResultBox title="Quick scenarios">
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

        <button
          type="button"
          onClick={validateInputs}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Compare mortgage options
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Mortgage comparison result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Best estimated option"
                value={result.bestOption.name}
                highlight
              />

              <StatCard
                label="Estimated financing cost"
                value={formatCurrency(
                  result.bestOption.financingCostDuringOwnership,
                  currency
                )}
              />

              <StatCard
                label="Monthly payment"
                value={formatCurrency(
                  result.bestOption.totalMonthlyPayment,
                  currency
                )}
              />

              <StatCard
                label="Savings vs highest cost"
                value={formatCurrency(result.savingsVsMostExpensive, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {result.health.label}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {result.health.description}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Option comparison">
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-7 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 lg:grid">
                <div>Option</div>
                <div>Rate</div>
                <div>Term</div>
                <div>Monthly</div>
                <div>Upfront</div>
                <div>Ownership cost</div>
                <div>Balance after ownership</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.optionResults.map((option) => (
                  <div
                    key={option.id}
                    className="grid gap-3 px-4 py-4 text-sm lg:grid-cols-7 lg:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Option
                      </div>
                      <div className="font-black text-black">{option.name}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Rate
                      </div>
                      <div className="font-bold text-black">
                        {formatPercent(option.interestRate)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Term
                      </div>
                      <div className="font-bold text-black">
                        {option.termYears} years
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Monthly
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(option.totalMonthlyPayment, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Upfront
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(option.upfrontCosts, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Ownership cost
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(
                          option.financingCostDuringOwnership,
                          currency
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 lg:hidden">
                        Balance after ownership
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(
                          option.remainingBalanceAfterOwnership,
                          currency
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Cost and interest details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Lowest monthly payment"
                value={result.lowestMonthlyOption.name}
              />

              <StatCard
                label="Lowest full-term interest"
                value={result.lowestInterestOption.name}
              />

              <StatCard
                label="Most expensive option"
                value={result.mostExpensiveOption.name}
              />

              <StatCard
                label="Ownership period"
                value={formatDuration(result.ownershipMonths)}
                highlight
              />
            </div>

            <div className="mt-5 grid gap-3">
              {result.optionResults.map((option) => (
                <BreakdownRow
                  key={`${option.id}-details`}
                  label={option.name}
                  value={`Monthly: ${formatCurrency(
                    option.totalMonthlyPayment,
                    currency
                  )} · Full-term interest: ${formatCurrency(
                    option.totalInterestFullTerm,
                    currency
                  )} · Ownership financing cost: ${formatCurrency(
                    option.financingCostDuringOwnership,
                    currency
                  )}`}
                />
              ))}
            </div>
          </ToolResultBox>

          <ToolResultBox title="Break-even check">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Option A vs Option B"
                value={
                  result.breakEvenMonths
                    ? formatDuration(result.breakEvenMonths)
                    : "No clear break-even"
                }
                highlight
              />

              <StatCard
                label="Expected ownership"
                value={formatDuration(result.ownershipMonths)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                What break-even means
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                A break-even point estimates when higher upfront costs may be
                offset by lower monthly payments. If there is no clear
                break-even, one option may be consistently cheaper under the
                current assumptions or the monthly and upfront cost structure
                may not cross over.
              </p>
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Mortgage comparison formulas"
            description="Open the formula summary to see how monthly payment, ownership cost and financing cost are estimated."
          >
            <div className="grid gap-3">
              <BreakdownRow
                label="Monthly payment"
                value="Principal and interest payment based on loan amount, interest rate and term."
              />

              <BreakdownRow
                label="Cash outflow during ownership"
                value="Monthly mortgage costs during ownership plus upfront costs."
              />

              <BreakdownRow
                label="Financing cost during ownership"
                value="Interest paid during ownership plus upfront costs and monthly add-ons."
              />

              <BreakdownRow
                label="Remaining balance"
                value="Estimated loan balance after the expected ownership period."
              />
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This mortgage comparison calculator provides estimates for planning
        purposes only. Actual mortgage costs can vary based on lender terms,
        APR, points, escrow, taxes, insurance, PMI, closing costs, prepayment
        rules and local requirements. It is not financial, legal or mortgage
        advice.
      </ToolInfoBox>
    </div>
  );
}

function MortgageOptionCard({
  option,
  currency,
  onChange,
}: {
  option: MortgageOptionInput;
  currency: CurrencyCode;
  onChange: (
    id: string,
    field: keyof Omit<MortgageOptionInput, "id">,
    value: string
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <TextInput
        label="Option name"
        value={option.name}
        onChange={(value) => onChange(option.id, "name", value)}
        helper="Example: Lower rate, No points, 15-year fixed."
      />

      <div className="mt-4 grid gap-4">
        <PercentInput
          label="Interest rate"
          value={option.interestRate}
          onChange={(value) => onChange(option.id, "interestRate", value)}
          helper="Annual mortgage interest rate."
        />

        <NumberInput
          label="Loan term"
          value={option.termYears}
          onChange={(value) => onChange(option.id, "termYears", value)}
          suffix="years"
          helper="Mortgage term for this offer."
        />

        <MoneyInput
          label="Upfront costs"
          value={option.upfrontCosts}
          onChange={(value) => onChange(option.id, "upfrontCosts", value)}
          currency={currency}
          helper="Points, lender fees or offer-specific closing costs."
        />

        <MoneyInput
          label="Monthly add-ons"
          value={option.monthlyCosts}
          onChange={(value) => onChange(option.id, "monthlyCosts", value)}
          currency={currency}
          helper="PMI, lender add-ons or monthly option-specific costs."
        />
      </div>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-5 text-left"
      >
        <div>
          <h3 className="text-lg font-black tracking-tight text-black">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/60">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-bold text-white">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}

function TextInput({
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

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />

      <p className="mt-2 text-xs leading-5 text-black/50">{helper}</p>
    </label>
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

function NumberInput({
  label,
  value,
  onChange,
  suffix,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
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
          {suffix}
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

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-sm font-black text-black">{value}</div>
    </div>
  );
}