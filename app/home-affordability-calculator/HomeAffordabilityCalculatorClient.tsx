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

type Scenario = {
  name: string;
  description: string;
  annualIncome: string;
  monthlyDebts: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
  propertyTaxRate: string;
  homeInsurance: string;
  hoaFees: string;
  housingDti: string;
  totalDti: string;
  closingCostRate: string;
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

const scenarios: Scenario[] = [
  {
    name: "Conservative buyer",
    description: "Lower DTI target and moderate down payment.",
    annualIncome: "85000",
    monthlyDebts: "450",
    downPayment: "60000",
    interestRate: "6.5",
    loanTerm: "30",
    propertyTaxRate: "1.1",
    homeInsurance: "160",
    hoaFees: "0",
    housingDti: "25",
    totalDti: "36",
    closingCostRate: "3",
  },
  {
    name: "Standard guideline",
    description: "Common housing and total debt assumptions.",
    annualIncome: "100000",
    monthlyDebts: "600",
    downPayment: "80000",
    interestRate: "6.5",
    loanTerm: "30",
    propertyTaxRate: "1.2",
    homeInsurance: "180",
    hoaFees: "100",
    housingDti: "28",
    totalDti: "36",
    closingCostRate: "3",
  },
  {
    name: "High income buyer",
    description: "Higher income with stronger down payment.",
    annualIncome: "180000",
    monthlyDebts: "900",
    downPayment: "180000",
    interestRate: "6.25",
    loanTerm: "30",
    propertyTaxRate: "1.1",
    homeInsurance: "240",
    hoaFees: "200",
    housingDti: "28",
    totalDti: "40",
    closingCostRate: "3",
  },
  {
    name: "Debt-heavy buyer",
    description: "Higher existing monthly debts reduce affordability.",
    annualIncome: "95000",
    monthlyDebts: "1600",
    downPayment: "70000",
    interestRate: "6.75",
    loanTerm: "30",
    propertyTaxRate: "1.25",
    homeInsurance: "190",
    hoaFees: "150",
    housingDti: "28",
    totalDti: "36",
    closingCostRate: "3",
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

  if (currency === "JPY") {
    return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
  }

  return `${symbol}${value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
  })}`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(Math.abs(value) >= 10 ? 1 : 2)}%`;
}

function getMortgagePayment({
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

function getAffordabilityLabel(totalDti: number, targetTotalDti: number) {
  if (totalDti <= targetTotalDti * 0.85) {
    return {
      label: "Comfortable",
      description:
        "The estimated monthly payment is meaningfully below your selected debt-to-income limit.",
    };
  }

  if (totalDti <= targetTotalDti) {
    return {
      label: "Within target",
      description:
        "The estimate is within your selected debt-to-income limit, but there may not be much extra room.",
    };
  }

  return {
    label: "Above target",
    description:
      "This estimate is above your selected debt-to-income limit and may be difficult to qualify for.",
  };
}

export default function HomeAffordabilityCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [annualIncome, setAnnualIncome] = useState("100000");
  const [monthlyDebts, setMonthlyDebts] = useState("600");
  const [downPayment, setDownPayment] = useState("80000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.2");
  const [homeInsurance, setHomeInsurance] = useState("180");
  const [hoaFees, setHoaFees] = useState("100");
  const [housingDti, setHousingDti] = useState("28");
  const [totalDti, setTotalDti] = useState("36");
  const [closingCostRate, setClosingCostRate] = useState("3");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const income = parseNumber(annualIncome);
    const debts = parseNumber(monthlyDebts);
    const down = parseNumber(downPayment);
    const rate = parseNumber(interestRate);
    const term = parseNumber(loanTerm);
    const taxRate = parseNumber(propertyTaxRate);
    const insurance = parseNumber(homeInsurance);
    const hoa = parseNumber(hoaFees);
    const housingRatio = parseNumber(housingDti);
    const totalRatio = parseNumber(totalDti);
    const closingRate = parseNumber(closingCostRate);

    const monthlyIncome = income / 12;
    const maxHousingPaymentByIncome = monthlyIncome * (housingRatio / 100);
    const maxHousingPaymentByTotalDebt = Math.max(
      0,
      monthlyIncome * (totalRatio / 100) - debts
    );

    const maxMonthlyHousingPayment = Math.min(
      maxHousingPaymentByIncome,
      maxHousingPaymentByTotalDebt
    );

    function getMonthlyHousingCost(price: number) {
      const loanAmount = Math.max(0, price - down);
      const mortgagePayment = getMortgagePayment({
        loanAmount,
        annualRate: rate,
        termYears: term,
      });
      const monthlyPropertyTax = (price * (taxRate / 100)) / 12;
      const monthlyHousingCost =
        mortgagePayment + monthlyPropertyTax + insurance + hoa;

      return {
        price,
        loanAmount,
        mortgagePayment,
        monthlyPropertyTax,
        monthlyHousingCost,
      };
    }

    let affordableHomePrice = 0;

    if (income > 0 && maxMonthlyHousingPayment > insurance + hoa) {
      let low = 0;
      let high = Math.max(down + income * 6, 100000);

      while (
        getMonthlyHousingCost(high).monthlyHousingCost <
          maxMonthlyHousingPayment &&
        high < 100000000
      ) {
        high *= 1.5;
      }

      for (let index = 0; index < 80; index += 1) {
        const mid = (low + high) / 2;
        const cost = getMonthlyHousingCost(mid).monthlyHousingCost;

        if (cost <= maxMonthlyHousingPayment) {
          low = mid;
        } else {
          high = mid;
        }
      }

      affordableHomePrice = low;
    }

    const affordableCosts = getMonthlyHousingCost(affordableHomePrice);
    const closingCosts = affordableHomePrice * (closingRate / 100);
    const cashNeeded = down + closingCosts;

    const frontEndDti =
      monthlyIncome > 0
        ? (affordableCosts.monthlyHousingCost / monthlyIncome) * 100
        : 0;

    const backEndDti =
      monthlyIncome > 0
        ? ((affordableCosts.monthlyHousingCost + debts) / monthlyIncome) * 100
        : 0;

    const downPaymentPercent =
      affordableHomePrice > 0 ? (down / affordableHomePrice) * 100 : 0;

    const scenarios = [0.85, 1, 1.1, 1.25].map((multiplier) => {
      const price = affordableHomePrice * multiplier;
      const costs = getMonthlyHousingCost(price);
      const scenarioFrontDti =
        monthlyIncome > 0
          ? (costs.monthlyHousingCost / monthlyIncome) * 100
          : 0;
      const scenarioBackDti =
        monthlyIncome > 0
          ? ((costs.monthlyHousingCost + debts) / monthlyIncome) * 100
          : 0;

      return {
        label:
          multiplier === 1
            ? "Estimated affordable price"
            : `${Math.round(multiplier * 100)}% of affordable price`,
        price,
        monthlyPayment: costs.monthlyHousingCost,
        frontDti: scenarioFrontDti,
        backDti: scenarioBackDti,
        status:
          scenarioFrontDti <= housingRatio && scenarioBackDti <= totalRatio
            ? "Within target"
            : "Above target",
      };
    });

    const health = getAffordabilityLabel(backEndDti, totalRatio);

    return {
      income,
      debts,
      down,
      rate,
      term,
      taxRate,
      insurance,
      hoa,
      housingRatio,
      totalRatio,
      closingRate,
      monthlyIncome,
      maxHousingPaymentByIncome,
      maxHousingPaymentByTotalDebt,
      maxMonthlyHousingPayment,
      affordableHomePrice,
      loanAmount: affordableCosts.loanAmount,
      mortgagePayment: affordableCosts.mortgagePayment,
      monthlyPropertyTax: affordableCosts.monthlyPropertyTax,
      monthlyHousingCost: affordableCosts.monthlyHousingCost,
      closingCosts,
      cashNeeded,
      frontEndDti,
      backEndDti,
      downPaymentPercent,
      scenarios,
      health,
    };
  }, [
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
    hoaFees,
    housingDti,
    totalDti,
    closingCostRate,
  ]);

  function validateInputs() {
    if (result.income <= 0) {
      setError("Annual income must be greater than zero.");
      return false;
    }

    if (result.down < 0) {
      setError("Down payment cannot be negative.");
      return false;
    }

    if (result.debts < 0) {
      setError("Monthly debts cannot be negative.");
      return false;
    }

    if (result.rate < 0) {
      setError("Mortgage interest rate cannot be negative.");
      return false;
    }

    if (result.term <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (result.housingRatio <= 0 || result.totalRatio <= 0) {
      setError("Debt-to-income ratios must be greater than zero.");
      return false;
    }

    if (result.totalRatio < result.housingRatio) {
      setError("Total DTI should be equal to or higher than housing DTI.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setAnnualIncome(scenario.annualIncome);
    setMonthlyDebts(scenario.monthlyDebts);
    setDownPayment(scenario.downPayment);
    setInterestRate(scenario.interestRate);
    setLoanTerm(scenario.loanTerm);
    setPropertyTaxRate(scenario.propertyTaxRate);
    setHomeInsurance(scenario.homeInsurance);
    setHoaFees(scenario.hoaFees);
    setHousingDti(scenario.housingDti);
    setTotalDti(scenario.totalDti);
    setClosingCostRate(scenario.closingCostRate);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Estimate how much house you can afford
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate an estimated affordable home price based on income, monthly
          debts, down payment, mortgage rate, property taxes, insurance, HOA
          fees and debt-to-income limits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Affordable home price"
          value={formatCurrency(result.affordableHomePrice, currency)}
          highlight
        />

        <StatCard
          label="Monthly housing payment"
          value={formatCurrency(result.monthlyHousingCost, currency)}
        />

        <StatCard
          label="Total DTI"
          value={formatPercent(result.backEndDti)}
        />
      </div>

      <ToolResultBox title="Income and debt inputs">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyInput
              label="Annual gross income"
              value={annualIncome}
              onChange={setAnnualIncome}
              currency={currency}
              helper="Total annual income before taxes."
            />

            <MoneyInput
              label="Monthly debts"
              value={monthlyDebts}
              onChange={setMonthlyDebts}
              currency={currency}
              helper="Car loans, student loans, credit cards and other monthly debts."
            />

            <PercentInput
              label="Housing DTI limit"
              value={housingDti}
              onChange={setHousingDti}
              helper="Maximum housing payment as a percentage of gross monthly income."
            />

            <PercentInput
              label="Total DTI limit"
              value={totalDti}
              onChange={setTotalDti}
              helper="Maximum total debt payments as a percentage of gross monthly income."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Mortgage and home cost inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyInput
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            currency={currency}
            helper="Cash available for the home purchase."
          />

          <PercentInput
            label="Mortgage interest rate"
            value={interestRate}
            onChange={setInterestRate}
            helper="Annual mortgage interest rate."
          />

          <NumberInput
            label="Loan term"
            value={loanTerm}
            onChange={setLoanTerm}
            suffix="years"
            helper="Length of the mortgage."
          />

          <PercentInput
            label="Property tax"
            value={propertyTaxRate}
            onChange={setPropertyTaxRate}
            helper="Annual property tax as a percentage of home value."
          />

          <MoneyInput
            label="Home insurance"
            value={homeInsurance}
            onChange={setHomeInsurance}
            currency={currency}
            helper="Estimated monthly homeowners insurance."
          />

          <MoneyInput
            label="HOA fees"
            value={hoaFees}
            onChange={setHoaFees}
            currency={currency}
            helper="Estimated monthly HOA or condo fees."
          />

          <PercentInput
            label="Closing costs"
            value={closingCostRate}
            onChange={setClosingCostRate}
            helper="Estimated closing costs as a percentage of home price."
          />
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
          Calculate affordability
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Affordability result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Affordable home price"
                value={formatCurrency(result.affordableHomePrice, currency)}
                highlight
              />

              <StatCard
                label="Estimated loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <StatCard
                label="Cash needed"
                value={formatCurrency(result.cashNeeded, currency)}
              />

              <StatCard
                label="Down payment"
                value={formatPercent(result.downPaymentPercent)}
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

          <ToolResultBox title="Monthly payment breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Mortgage payment"
                value={formatCurrency(result.mortgagePayment, currency)}
              />

              <StatCard
                label="Property tax"
                value={formatCurrency(result.monthlyPropertyTax, currency)}
              />

              <StatCard
                label="Insurance"
                value={formatCurrency(result.insurance, currency)}
              />

              <StatCard
                label="HOA fees"
                value={formatCurrency(result.hoa, currency)}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Monthly income"
                value={formatCurrency(result.monthlyIncome, currency)}
              />

              <StatCard
                label="Housing DTI"
                value={formatPercent(result.frontEndDti)}
              />

              <StatCard
                label="Total DTI"
                value={formatPercent(result.backEndDti)}
                highlight
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Affordability limits">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Housing payment limit"
                value={formatCurrency(
                  result.maxHousingPaymentByIncome,
                  currency
                )}
              />

              <StatCard
                label="Debt-adjusted limit"
                value={formatCurrency(
                  result.maxHousingPaymentByTotalDebt,
                  currency
                )}
              />

              <StatCard
                label="Used payment limit"
                value={formatCurrency(
                  result.maxMonthlyHousingPayment,
                  currency
                )}
                highlight
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-black/60">
              The calculator uses the lower of your housing DTI limit and your
              total debt-adjusted payment limit.
            </p>
          </ToolResultBox>

          <TogglePanel
            title="Home price scenarios"
            description="Open the scenario table to compare monthly payment and DTI at different home prices."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-5 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Scenario</div>
                <div>Home price</div>
                <div>Monthly payment</div>
                <div>Total DTI</div>
                <div>Status</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.scenarios.map((scenario) => (
                  <div
                    key={scenario.label}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-5 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Scenario
                      </div>
                      <div className="font-bold text-black">
                        {scenario.label}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Home price
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(scenario.price, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Monthly payment
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(scenario.monthlyPayment, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Total DTI
                      </div>
                      <div className="font-bold text-black">
                        {formatPercent(scenario.backDti)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Status
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          scenario.status === "Within target"
                            ? "bg-black text-white"
                            : "bg-black/10 text-black"
                        }`}
                      >
                        {scenario.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This calculator provides an estimate only and is not a mortgage approval
        or lending decision. Actual affordability depends on lender guidelines,
        credit profile, interest rates, taxes, insurance, local costs and
        personal financial goals.
      </ToolInfoBox>
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