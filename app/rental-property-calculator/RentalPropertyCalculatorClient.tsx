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
  purchasePrice: string;
  downPaymentPercent: string;
  closingCostsPercent: string;
  interestRate: string;
  loanTerm: string;
  monthlyMortgagePayment: string;
  monthlyRent: string;
  vacancyRate: string;
  annualPropertyTax: string;
  annualInsurance: string;
  monthlyMaintenance: string;
  monthlyHoa: string;
  managementFeePercent: string;
  otherMonthlyExpenses: string;
  appreciationRate: string;
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
    name: "Balanced rental",
    description: "A typical financed rental with moderate expenses.",
    purchasePrice: "300000",
    downPaymentPercent: "25",
    closingCostsPercent: "3",
    interestRate: "6.5",
    loanTerm: "30",
    monthlyMortgagePayment: "0",
    monthlyRent: "2400",
    vacancyRate: "5",
    annualPropertyTax: "3600",
    annualInsurance: "1200",
    monthlyMaintenance: "200",
    monthlyHoa: "0",
    managementFeePercent: "8",
    otherMonthlyExpenses: "100",
    appreciationRate: "3",
  },
  {
    name: "Cash-flow focus",
    description: "Higher rent relative to purchase price.",
    purchasePrice: "220000",
    downPaymentPercent: "25",
    closingCostsPercent: "3",
    interestRate: "6.75",
    loanTerm: "30",
    monthlyMortgagePayment: "0",
    monthlyRent: "2300",
    vacancyRate: "6",
    annualPropertyTax: "2800",
    annualInsurance: "1100",
    monthlyMaintenance: "180",
    monthlyHoa: "0",
    managementFeePercent: "8",
    otherMonthlyExpenses: "75",
    appreciationRate: "2.5",
  },
  {
    name: "Low down payment",
    description: "Lower cash invested but higher monthly debt payment.",
    purchasePrice: "350000",
    downPaymentPercent: "15",
    closingCostsPercent: "3",
    interestRate: "6.8",
    loanTerm: "30",
    monthlyMortgagePayment: "0",
    monthlyRent: "2800",
    vacancyRate: "5",
    annualPropertyTax: "4200",
    annualInsurance: "1400",
    monthlyMaintenance: "250",
    monthlyHoa: "100",
    managementFeePercent: "8",
    otherMonthlyExpenses: "100",
    appreciationRate: "3",
  },
  {
    name: "Higher expenses",
    description: "Test a property with higher taxes, HOA and maintenance.",
    purchasePrice: "425000",
    downPaymentPercent: "25",
    closingCostsPercent: "3",
    interestRate: "6.5",
    loanTerm: "30",
    monthlyMortgagePayment: "0",
    monthlyRent: "3200",
    vacancyRate: "7",
    annualPropertyTax: "6500",
    annualInsurance: "1800",
    monthlyMaintenance: "350",
    monthlyHoa: "250",
    managementFeePercent: "8",
    otherMonthlyExpenses: "150",
    appreciationRate: "3",
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

function formatMultiplier(value: number) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)}x`;
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

function getRentalLabel({
  monthlyCashFlow,
  cashOnCashReturn,
  capRate,
}: {
  monthlyCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
}) {
  if (monthlyCashFlow < 0) {
    return {
      label: "Negative estimated cash flow",
      description:
        "This property is estimated to lose money each month after operating expenses and debt service. Review rent, financing and expense assumptions carefully.",
    };
  }

  if (monthlyCashFlow >= 0 && cashOnCashReturn < 4) {
    return {
      label: "Positive but low return",
      description:
        "The property is estimated to produce positive cash flow, but the cash-on-cash return is relatively low based on the current assumptions.",
    };
  }

  if (cashOnCashReturn >= 8 && capRate >= 6) {
    return {
      label: "Strong rental estimate",
      description:
        "The property shows positive cash flow with a strong estimated cash-on-cash return and cap rate under these assumptions.",
    };
  }

  if (cashOnCashReturn >= 5) {
    return {
      label: "Solid rental estimate",
      description:
        "The property shows positive cash flow and a reasonable estimated return based on the numbers entered.",
    };
  }

  return {
    label: "Review the assumptions",
    description:
      "The property may work depending on your goals, but small changes in rent, vacancy, financing or expenses could significantly affect the result.",
  };
}

export default function RentalPropertyCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [purchasePrice, setPurchasePrice] = useState("300000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("25");
  const [closingCostsPercent, setClosingCostsPercent] = useState("3");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [monthlyMortgagePayment, setMonthlyMortgagePayment] = useState("0");

  const [monthlyRent, setMonthlyRent] = useState("2400");
  const [vacancyRate, setVacancyRate] = useState("5");
  const [annualPropertyTax, setAnnualPropertyTax] = useState("3600");
  const [annualInsurance, setAnnualInsurance] = useState("1200");
  const [monthlyMaintenance, setMonthlyMaintenance] = useState("200");
  const [monthlyHoa, setMonthlyHoa] = useState("0");
  const [managementFeePercent, setManagementFeePercent] = useState("8");
  const [otherMonthlyExpenses, setOtherMonthlyExpenses] = useState("100");
  const [appreciationRate, setAppreciationRate] = useState("3");

  const [error, setError] = useState("");

  const result = useMemo(() => {
    const price = parseNumber(purchasePrice);
    const downPaymentRate = parseNumber(downPaymentPercent);
    const closingCostsRate = parseNumber(closingCostsPercent);
    const rate = parseNumber(interestRate);
    const term = parseNumber(loanTerm);
    const enteredMortgagePayment = parseNumber(monthlyMortgagePayment);

    const rent = parseNumber(monthlyRent);
    const vacancy = parseNumber(vacancyRate);
    const propertyTax = parseNumber(annualPropertyTax);
    const insurance = parseNumber(annualInsurance);
    const maintenance = parseNumber(monthlyMaintenance);
    const hoa = parseNumber(monthlyHoa);
    const managementFeeRate = parseNumber(managementFeePercent);
    const otherExpenses = parseNumber(otherMonthlyExpenses);
    const appreciation = parseNumber(appreciationRate);

    const downPaymentAmount = price * (downPaymentRate / 100);
    const loanAmount = Math.max(0, price - downPaymentAmount);
    const closingCosts = price * (closingCostsRate / 100);
    const totalCashInvested = downPaymentAmount + closingCosts;

    const calculatedMortgagePayment = getMortgagePayment({
      loanAmount,
      annualRate: rate,
      termYears: term,
    });

    const mortgagePayment =
      enteredMortgagePayment > 0
        ? enteredMortgagePayment
        : calculatedMortgagePayment;

    const grossMonthlyRent = rent;
    const grossAnnualRent = grossMonthlyRent * 12;

    const monthlyVacancyLoss = grossMonthlyRent * (vacancy / 100);
    const effectiveMonthlyIncome = grossMonthlyRent - monthlyVacancyLoss;
    const effectiveAnnualIncome = effectiveMonthlyIncome * 12;

    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsuranceCost = insurance / 12;
    const monthlyManagementFee = grossMonthlyRent * (managementFeeRate / 100);

    const operatingExpenses =
      monthlyPropertyTax +
      monthlyInsuranceCost +
      maintenance +
      hoa +
      monthlyManagementFee +
      otherExpenses;

    const totalMonthlyExpensesWithDebt = operatingExpenses + mortgagePayment;

    const monthlyNoi = effectiveMonthlyIncome - operatingExpenses;
    const annualNoi = monthlyNoi * 12;

    const monthlyCashFlow = monthlyNoi - mortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;

    const capRate = price > 0 ? (annualNoi / price) * 100 : 0;

    const cashOnCashReturn =
      totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    const expenseRatio =
      effectiveMonthlyIncome > 0
        ? (operatingExpenses / effectiveMonthlyIncome) * 100
        : 0;

    const rentToPriceRatio =
      price > 0 ? ((grossMonthlyRent * 12) / price) * 100 : 0;

    const grossRentMultiplier =
      grossAnnualRent > 0 ? price / grossAnnualRent : Number.POSITIVE_INFINITY;

    const debtServiceCoverageRatio =
      mortgagePayment > 0 ? monthlyNoi / mortgagePayment : Number.POSITIVE_INFINITY;

    const fixedMonthlyCostsForBreakEven =
      mortgagePayment +
      monthlyPropertyTax +
      monthlyInsuranceCost +
      maintenance +
      hoa +
      otherExpenses;

    const variableRentCostRate = vacancy / 100 + managementFeeRate / 100;

    const breakEvenRent =
      variableRentCostRate < 1
        ? fixedMonthlyCostsForBreakEven / (1 - variableRentCostRate)
        : Number.POSITIVE_INFINITY;

    const projectedValueAfterFiveYears =
      price * Math.pow(1 + appreciation / 100, 5);

    const projectedAppreciationGain = projectedValueAfterFiveYears - price;

    const health = getRentalLabel({
      monthlyCashFlow,
      cashOnCashReturn,
      capRate,
    });

    return {
      price,
      downPaymentRate,
      closingCostsRate,
      rate,
      term,
      enteredMortgagePayment,
      rent,
      vacancy,
      propertyTax,
      insurance,
      maintenance,
      hoa,
      managementFeeRate,
      otherExpenses,
      appreciation,
      downPaymentAmount,
      loanAmount,
      closingCosts,
      totalCashInvested,
      calculatedMortgagePayment,
      mortgagePayment,
      grossMonthlyRent,
      grossAnnualRent,
      monthlyVacancyLoss,
      effectiveMonthlyIncome,
      effectiveAnnualIncome,
      monthlyPropertyTax,
      monthlyInsuranceCost,
      monthlyManagementFee,
      operatingExpenses,
      totalMonthlyExpensesWithDebt,
      monthlyNoi,
      annualNoi,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      expenseRatio,
      rentToPriceRatio,
      grossRentMultiplier,
      debtServiceCoverageRatio,
      breakEvenRent,
      projectedValueAfterFiveYears,
      projectedAppreciationGain,
      health,
    };
  }, [
    purchasePrice,
    downPaymentPercent,
    closingCostsPercent,
    interestRate,
    loanTerm,
    monthlyMortgagePayment,
    monthlyRent,
    vacancyRate,
    annualPropertyTax,
    annualInsurance,
    monthlyMaintenance,
    monthlyHoa,
    managementFeePercent,
    otherMonthlyExpenses,
    appreciationRate,
  ]);

  function validateInputs() {
    if (result.price <= 0) {
      setError("Purchase price must be greater than zero.");
      return false;
    }

    if (result.downPaymentRate < 0 || result.downPaymentRate > 100) {
      setError("Down payment must be between 0% and 100%.");
      return false;
    }

    if (result.closingCostsRate < 0 || result.closingCostsRate > 100) {
      setError("Closing costs must be between 0% and 100%.");
      return false;
    }

    if (result.rate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (result.term <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (result.enteredMortgagePayment < 0) {
      setError("Monthly mortgage payment cannot be negative.");
      return false;
    }

    if (result.rent < 0) {
      setError("Monthly rent cannot be negative.");
      return false;
    }

    if (result.vacancy < 0 || result.vacancy > 100) {
      setError("Vacancy rate must be between 0% and 100%.");
      return false;
    }

    if (
      result.propertyTax < 0 ||
      result.insurance < 0 ||
      result.maintenance < 0 ||
      result.hoa < 0 ||
      result.otherExpenses < 0
    ) {
      setError("Expenses cannot be negative.");
      return false;
    }

    if (result.managementFeeRate < 0 || result.managementFeeRate > 100) {
      setError("Management fee must be between 0% and 100%.");
      return false;
    }

    if (result.appreciation < -100 || result.appreciation > 100) {
      setError("Appreciation rate must be between -100% and 100%.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setPurchasePrice(scenario.purchasePrice);
    setDownPaymentPercent(scenario.downPaymentPercent);
    setClosingCostsPercent(scenario.closingCostsPercent);
    setInterestRate(scenario.interestRate);
    setLoanTerm(scenario.loanTerm);
    setMonthlyMortgagePayment(scenario.monthlyMortgagePayment);
    setMonthlyRent(scenario.monthlyRent);
    setVacancyRate(scenario.vacancyRate);
    setAnnualPropertyTax(scenario.annualPropertyTax);
    setAnnualInsurance(scenario.annualInsurance);
    setMonthlyMaintenance(scenario.monthlyMaintenance);
    setMonthlyHoa(scenario.monthlyHoa);
    setManagementFeePercent(scenario.managementFeePercent);
    setOtherMonthlyExpenses(scenario.otherMonthlyExpenses);
    setAppreciationRate(scenario.appreciationRate);
    setError("");
  }

  function useCalculatedMortgagePayment() {
    setMonthlyMortgagePayment(result.calculatedMortgagePayment.toFixed(2));
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Analyze rental property returns
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate monthly cash flow, annual cash flow, cap rate, cash-on-cash
          return, net operating income and break-even rent for a rental
          property.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly cash flow"
          value={formatCurrency(result.monthlyCashFlow, currency)}
          highlight
        />

        <StatCard
          label="Cash-on-cash return"
          value={formatPercent(result.cashOnCashReturn)}
        />

        <StatCard
          label="Cap rate"
          value={formatPercent(result.capRate)}
        />
      </div>

      <ToolResultBox title="Purchase and financing inputs">
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
              label="Purchase price"
              value={purchasePrice}
              onChange={setPurchasePrice}
              currency={currency}
              helper="Expected purchase price of the rental property."
            />

            <PercentInput
              label="Down payment"
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
              helper="Percentage of the purchase price paid upfront."
            />

            <PercentInput
              label="Closing costs"
              value={closingCostsPercent}
              onChange={setClosingCostsPercent}
              helper="Estimated closing costs as a percentage of purchase price."
            />

            <PercentInput
              label="Interest rate"
              value={interestRate}
              onChange={setInterestRate}
              helper="Annual mortgage interest rate."
            />

            <NumberInput
              label="Loan term"
              value={loanTerm}
              onChange={setLoanTerm}
              suffix="years"
              helper="Mortgage term used to estimate the monthly payment."
            />

            <MoneyInput
              label="Monthly mortgage payment"
              value={monthlyMortgagePayment}
              onChange={setMonthlyMortgagePayment}
              currency={currency}
              helper="Enter 0 to use the calculated principal and interest payment."
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-black text-black">
                  Estimated loan and payment
                </div>

                <p className="mt-1 text-xs leading-5 text-black/60">
                  Loan amount:{" "}
                  <strong>{formatCurrency(result.loanAmount, currency)}</strong>{" "}
                  · Estimated mortgage payment:{" "}
                  <strong>
                    {formatCurrency(result.calculatedMortgagePayment, currency)}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={useCalculatedMortgagePayment}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Use this payment
              </button>
            </div>
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Rental income and expenses">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MoneyInput
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            currency={currency}
            helper="Expected monthly rental income before vacancy."
          />

          <PercentInput
            label="Vacancy rate"
            value={vacancyRate}
            onChange={setVacancyRate}
            helper="Expected percentage of lost rent from vacancy."
          />

          <MoneyInput
            label="Annual property tax"
            value={annualPropertyTax}
            onChange={setAnnualPropertyTax}
            currency={currency}
            helper="Estimated yearly property tax."
          />

          <MoneyInput
            label="Annual insurance"
            value={annualInsurance}
            onChange={setAnnualInsurance}
            currency={currency}
            helper="Estimated yearly insurance cost."
          />

          <MoneyInput
            label="Monthly maintenance"
            value={monthlyMaintenance}
            onChange={setMonthlyMaintenance}
            currency={currency}
            helper="Repairs, maintenance and reserve estimate."
          />

          <MoneyInput
            label="Monthly HOA"
            value={monthlyHoa}
            onChange={setMonthlyHoa}
            currency={currency}
            helper="Monthly HOA or condo fees."
          />

          <PercentInput
            label="Management fee"
            value={managementFeePercent}
            onChange={setManagementFeePercent}
            helper="Property management fee as a percentage of monthly rent."
          />

          <MoneyInput
            label="Other monthly expenses"
            value={otherMonthlyExpenses}
            onChange={setOtherMonthlyExpenses}
            currency={currency}
            helper="Utilities, admin, landscaping or other recurring costs."
          />

          <PercentInput
            label="Annual appreciation"
            value={appreciationRate}
            onChange={setAppreciationRate}
            helper="Optional property value growth estimate."
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
          Calculate rental returns
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Rental property result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Monthly cash flow"
                value={formatCurrency(result.monthlyCashFlow, currency)}
                highlight
              />

              <StatCard
                label="Annual cash flow"
                value={formatCurrency(result.annualCashFlow, currency)}
              />

              <StatCard
                label="Cap rate"
                value={formatPercent(result.capRate)}
              />

              <StatCard
                label="Cash-on-cash return"
                value={formatPercent(result.cashOnCashReturn)}
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

          <ToolResultBox title="Income and expense breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Gross monthly rent"
                value={formatCurrency(result.grossMonthlyRent, currency)}
              />

              <StatCard
                label="Effective monthly income"
                value={formatCurrency(result.effectiveMonthlyIncome, currency)}
                highlight
              />

              <StatCard
                label="Operating expenses"
                value={formatCurrency(result.operatingExpenses, currency)}
              />

              <StatCard
                label="Net operating income"
                value={formatCurrency(result.annualNoi, currency)}
              />
            </div>

            <div className="mt-5 grid gap-3">
              <BreakdownRow
                label="Monthly vacancy loss"
                value={formatCurrency(result.monthlyVacancyLoss, currency)}
              />

              <BreakdownRow
                label="Monthly property tax"
                value={formatCurrency(result.monthlyPropertyTax, currency)}
              />

              <BreakdownRow
                label="Monthly insurance"
                value={formatCurrency(result.monthlyInsuranceCost, currency)}
              />

              <BreakdownRow
                label="Monthly management fee"
                value={formatCurrency(result.monthlyManagementFee, currency)}
              />

              <BreakdownRow
                label="Total monthly expenses with debt"
                value={formatCurrency(
                  result.totalMonthlyExpensesWithDebt,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Investment metrics">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Cash invested"
                value={formatCurrency(result.totalCashInvested, currency)}
              />

              <StatCard
                label="Expense ratio"
                value={formatPercent(result.expenseRatio)}
              />

              <StatCard
                label="Break-even rent"
                value={formatCurrency(result.breakEvenRent, currency)}
                highlight
              />

              <StatCard
                label="DSCR"
                value={formatMultiplier(result.debtServiceCoverageRatio)}
              />
            </div>

            <div className="mt-5 grid gap-3">
              <BreakdownRow
                label="Down payment"
                value={formatCurrency(result.downPaymentAmount, currency)}
              />

              <BreakdownRow
                label="Closing costs"
                value={formatCurrency(result.closingCosts, currency)}
              />

              <BreakdownRow
                label="Loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <BreakdownRow
                label="Rent-to-price ratio"
                value={formatPercent(result.rentToPriceRatio)}
              />

              <BreakdownRow
                label="Gross rent multiplier"
                value={formatMultiplier(result.grossRentMultiplier)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Appreciation estimate">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Current property value"
                value={formatCurrency(result.price, currency)}
              />

              <StatCard
                label="Estimated value in 5 years"
                value={formatCurrency(
                  result.projectedValueAfterFiveYears,
                  currency
                )}
                highlight
              />

              <StatCard
                label="Estimated appreciation gain"
                value={formatCurrency(result.projectedAppreciationGain, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                Appreciation is not guaranteed
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                This estimate assumes a constant annual appreciation rate of{" "}
                <strong>{formatPercent(result.appreciation)}</strong>. Actual
                property values can rise or fall based on market conditions,
                location, interest rates and property-specific factors.
              </p>
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Rental calculation summary"
            description="Open the summary to review the core formulas used for cash flow, NOI, cap rate and cash-on-cash return."
          >
            <div className="grid gap-3">
              <BreakdownRow
                label="Effective income"
                value={`${formatCurrency(
                  result.grossMonthlyRent,
                  currency
                )} - ${formatCurrency(result.monthlyVacancyLoss, currency)}`}
              />

              <BreakdownRow
                label="Monthly NOI"
                value={`${formatCurrency(
                  result.effectiveMonthlyIncome,
                  currency
                )} - ${formatCurrency(result.operatingExpenses, currency)} = ${formatCurrency(
                  result.monthlyNoi,
                  currency
                )}`}
              />

              <BreakdownRow
                label="Monthly cash flow"
                value={`${formatCurrency(
                  result.monthlyNoi,
                  currency
                )} - ${formatCurrency(result.mortgagePayment, currency)} = ${formatCurrency(
                  result.monthlyCashFlow,
                  currency
                )}`}
              />

              <BreakdownRow
                label="Cap rate"
                value={`${formatCurrency(result.annualNoi, currency)} ÷ ${formatCurrency(
                  result.price,
                  currency
                )} = ${formatPercent(result.capRate)}`}
              />

              <BreakdownRow
                label="Cash-on-cash return"
                value={`${formatCurrency(
                  result.annualCashFlow,
                  currency
                )} ÷ ${formatCurrency(result.totalCashInvested, currency)} = ${formatPercent(
                  result.cashOnCashReturn
                )}`}
              />
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This rental property calculator provides estimates for planning and
        comparison purposes only. Actual investment results can vary due to
        taxes, financing terms, vacancy, repairs, local regulations, insurance,
        rent changes, market conditions and unexpected expenses. It is not
        financial, tax, legal or investment advice.
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

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-bold text-black/60">{label}</div>
      <div className="text-sm font-black text-black">{value}</div>
    </div>
  );
}