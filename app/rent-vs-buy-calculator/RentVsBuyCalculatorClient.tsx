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
  homePrice: string;
  downPayment: string;
  mortgageRate: string;
  loanTerm: string;
  propertyTaxRate: string;
  homeInsurance: string;
  maintenanceRate: string;
  hoaFees: string;
  closingCosts: string;
  sellingCostRate: string;
  appreciationRate: string;
  monthlyRent: string;
  rentIncreaseRate: string;
  renterInsurance: string;
  investmentReturn: string;
  years: string;
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
    name: "Starter home",
    description: "Moderate home price and stable rent.",
    homePrice: "350000",
    downPayment: "70000",
    mortgageRate: "6.5",
    loanTerm: "30",
    propertyTaxRate: "1.1",
    homeInsurance: "150",
    maintenanceRate: "1",
    hoaFees: "0",
    closingCosts: "9000",
    sellingCostRate: "6",
    appreciationRate: "3",
    monthlyRent: "1900",
    rentIncreaseRate: "3",
    renterInsurance: "25",
    investmentReturn: "5",
    years: "7",
  },
  {
    name: "High-rent city",
    description: "Higher rent with strong home appreciation.",
    homePrice: "650000",
    downPayment: "130000",
    mortgageRate: "6.75",
    loanTerm: "30",
    propertyTaxRate: "1.2",
    homeInsurance: "220",
    maintenanceRate: "1",
    hoaFees: "250",
    closingCosts: "16000",
    sellingCostRate: "6",
    appreciationRate: "4",
    monthlyRent: "3500",
    rentIncreaseRate: "4",
    renterInsurance: "35",
    investmentReturn: "5",
    years: "10",
  },
  {
    name: "Expensive ownership",
    description: "Higher costs and slower appreciation.",
    homePrice: "500000",
    downPayment: "100000",
    mortgageRate: "7",
    loanTerm: "30",
    propertyTaxRate: "1.5",
    homeInsurance: "250",
    maintenanceRate: "1.5",
    hoaFees: "300",
    closingCosts: "14000",
    sellingCostRate: "6",
    appreciationRate: "2",
    monthlyRent: "2400",
    rentIncreaseRate: "3",
    renterInsurance: "30",
    investmentReturn: "6",
    years: "5",
  },
  {
    name: "Long-term buyer",
    description: "Longer holding period favors building equity.",
    homePrice: "420000",
    downPayment: "84000",
    mortgageRate: "6.25",
    loanTerm: "30",
    propertyTaxRate: "1.1",
    homeInsurance: "170",
    maintenanceRate: "1",
    hoaFees: "50",
    closingCosts: "11000",
    sellingCostRate: "6",
    appreciationRate: "3",
    monthlyRent: "2300",
    rentIncreaseRate: "3",
    renterInsurance: "25",
    investmentReturn: "5",
    years: "15",
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

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  });
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

function getRemainingMortgageBalance({
  loanAmount,
  annualRate,
  termYears,
  paidMonths,
}: {
  loanAmount: number;
  annualRate: number;
  termYears: number;
  paidMonths: number;
}) {
  const totalMonths = Math.max(1, Math.round(termYears * 12));
  const monthsPaid = Math.min(Math.max(0, paidMonths), totalMonths);
  const monthlyRate = annualRate / 100 / 12;

  if (loanAmount <= 0 || monthsPaid >= totalMonths) {
    return 0;
  }

  if (monthlyRate === 0) {
    return loanAmount * (1 - monthsPaid / totalMonths);
  }

  return (
    loanAmount *
    ((Math.pow(1 + monthlyRate, totalMonths) -
      Math.pow(1 + monthlyRate, monthsPaid)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1))
  );
}

export default function RentVsBuyCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  const [homePrice, setHomePrice] = useState("350000");
  const [downPayment, setDownPayment] = useState("70000");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.1");
  const [homeInsurance, setHomeInsurance] = useState("150");
  const [maintenanceRate, setMaintenanceRate] = useState("1");
  const [hoaFees, setHoaFees] = useState("0");
  const [closingCosts, setClosingCosts] = useState("9000");
  const [sellingCostRate, setSellingCostRate] = useState("6");
  const [appreciationRate, setAppreciationRate] = useState("3");

  const [monthlyRent, setMonthlyRent] = useState("1900");
  const [rentIncreaseRate, setRentIncreaseRate] = useState("3");
  const [renterInsurance, setRenterInsurance] = useState("25");
  const [investmentReturn, setInvestmentReturn] = useState("5");

  const [years, setYears] = useState("7");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const price = parseNumber(homePrice);
    const down = parseNumber(downPayment);
    const rate = parseNumber(mortgageRate);
    const term = parseNumber(loanTerm);
    const taxRate = parseNumber(propertyTaxRate);
    const insurance = parseNumber(homeInsurance);
    const maintenance = parseNumber(maintenanceRate);
    const hoa = parseNumber(hoaFees);
    const closing = parseNumber(closingCosts);
    const sellingRate = parseNumber(sellingCostRate);
    const appreciation = parseNumber(appreciationRate);

    const rent = parseNumber(monthlyRent);
    const rentIncrease = parseNumber(rentIncreaseRate);
    const renterIns = parseNumber(renterInsurance);
    const returnRate = parseNumber(investmentReturn);

    const holdingYears = parseNumber(years);

    const loanAmount = Math.max(0, price - down);
    const mortgagePayment = getMortgagePayment({
      loanAmount,
      annualRate: rate,
      termYears: term,
    });

    const monthlyPropertyTax = (price * (taxRate / 100)) / 12;
    const monthlyMaintenance = (price * (maintenance / 100)) / 12;
    const monthlyOwnerExtras =
      monthlyPropertyTax + insurance + monthlyMaintenance + hoa;

    function calculateForHorizon(horizonYears: number) {
      const months = Math.max(1, Math.round(horizonYears * 12));
      const termMonths = Math.max(1, Math.round(term * 12));
      const paidMortgageMonths = Math.min(months, termMonths);

      const remainingBalance = getRemainingMortgageBalance({
        loanAmount,
        annualRate: rate,
        termYears: term,
        paidMonths: paidMortgageMonths,
      });

      const totalMortgagePaid = mortgagePayment * paidMortgageMonths;
      const principalPaid = Math.max(0, loanAmount - remainingBalance);
      const interestPaid = Math.max(0, totalMortgagePaid - principalPaid);

      const totalOwnerExtras = monthlyOwnerExtras * months;
      const upfrontBuyingCost = down + closing;
      const homeValue = price * Math.pow(1 + appreciation / 100, horizonYears);
      const sellingCosts = homeValue * (sellingRate / 100);
      const netSaleProceeds = Math.max(
        0,
        homeValue - remainingBalance - sellingCosts
      );

      const totalBuyingCashOut =
        upfrontBuyingCost + totalMortgagePaid + totalOwnerExtras;

      const buyNetCost = totalBuyingCashOut - netSaleProceeds;

      let rentMonth = rent;
      let totalRentPaid = 0;
      let investmentBalance = upfrontBuyingCost;
      let investmentContributions = upfrontBuyingCost;

      const monthlyInvestmentReturn = returnRate / 100 / 12;

      for (let month = 1; month <= months; month += 1) {
        if (month > 1 && (month - 1) % 12 === 0) {
          rentMonth *= 1 + rentIncrease / 100;
        }

        const monthlyRentCost = rentMonth + renterIns;
        totalRentPaid += monthlyRentCost;

        investmentBalance *= 1 + monthlyInvestmentReturn;

        const ownerCostThisMonth =
          (month <= termMonths ? mortgagePayment : 0) + monthlyOwnerExtras;

        const monthlySavingsToInvest = Math.max(
          0,
          ownerCostThisMonth - monthlyRentCost
        );

        investmentBalance += monthlySavingsToInvest;
        investmentContributions += monthlySavingsToInvest;
      }

      const investmentGains = Math.max(
        0,
        investmentBalance - investmentContributions
      );

      const rentNetCost = totalRentPaid - investmentGains;

      return {
        years: horizonYears,
        months,
        remainingBalance,
        totalMortgagePaid,
        principalPaid,
        interestPaid,
        totalOwnerExtras,
        upfrontBuyingCost,
        homeValue,
        sellingCosts,
        netSaleProceeds,
        totalBuyingCashOut,
        buyNetCost,
        totalRentPaid,
        investmentBalance,
        investmentContributions,
        investmentGains,
        rentNetCost,
      };
    }

    const comparison = calculateForHorizon(holdingYears);

    const projectionYears = [1, 3, 5, 7, 10, 15, 20, 30].filter(
      (item) => item <= Math.max(30, holdingYears)
    );

    const projection = projectionYears.map((item) => {
      const row = calculateForHorizon(item);
      const better =
        row.buyNetCost < row.rentNetCost
          ? "Buy"
          : row.rentNetCost < row.buyNetCost
            ? "Rent"
            : "Tie";

      return {
        ...row,
        better,
        difference: Math.abs(row.buyNetCost - row.rentNetCost),
      };
    });

    const buyAdvantage = comparison.rentNetCost - comparison.buyNetCost;
    const betterOption =
      Math.abs(buyAdvantage) < Math.max(250, Math.abs(comparison.rentNetCost) * 0.02)
        ? "Close"
        : buyAdvantage > 0
          ? "Buy"
          : "Rent";

    const monthlyOwnershipCost = mortgagePayment + monthlyOwnerExtras;
    const currentRentCost = rent + renterIns;
    const monthlyDifference = monthlyOwnershipCost - currentRentCost;

    const breakEvenProjection = projection.find(
      (row) => row.buyNetCost <= row.rentNetCost
    );

    return {
      price,
      down,
      rate,
      term,
      taxRate,
      insurance,
      maintenance,
      hoa,
      closing,
      sellingRate,
      appreciation,
      rent,
      rentIncrease,
      renterIns,
      returnRate,
      holdingYears,
      loanAmount,
      mortgagePayment,
      monthlyPropertyTax,
      monthlyMaintenance,
      monthlyOwnerExtras,
      monthlyOwnershipCost,
      currentRentCost,
      monthlyDifference,
      comparison,
      projection,
      buyAdvantage,
      betterOption,
      breakEvenYears: breakEvenProjection?.years ?? null,
    };
  }, [
    homePrice,
    downPayment,
    mortgageRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
    maintenanceRate,
    hoaFees,
    closingCosts,
    sellingCostRate,
    appreciationRate,
    monthlyRent,
    rentIncreaseRate,
    renterInsurance,
    investmentReturn,
    years,
  ]);

  function validateInputs() {
    if (result.price <= 0) {
      setError("Home price must be greater than zero.");
      return false;
    }

    if (result.down < 0 || result.down > result.price) {
      setError("Down payment must be between zero and the home price.");
      return false;
    }

    if (result.term <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (result.rate < 0) {
      setError("Mortgage rate cannot be negative.");
      return false;
    }

    if (result.rent <= 0) {
      setError("Monthly rent must be greater than zero.");
      return false;
    }

    if (result.holdingYears <= 0) {
      setError("Years to compare must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function applyScenario(scenario: Scenario) {
    setHomePrice(scenario.homePrice);
    setDownPayment(scenario.downPayment);
    setMortgageRate(scenario.mortgageRate);
    setLoanTerm(scenario.loanTerm);
    setPropertyTaxRate(scenario.propertyTaxRate);
    setHomeInsurance(scenario.homeInsurance);
    setMaintenanceRate(scenario.maintenanceRate);
    setHoaFees(scenario.hoaFees);
    setClosingCosts(scenario.closingCosts);
    setSellingCostRate(scenario.sellingCostRate);
    setAppreciationRate(scenario.appreciationRate);
    setMonthlyRent(scenario.monthlyRent);
    setRentIncreaseRate(scenario.rentIncreaseRate);
    setRenterInsurance(scenario.renterInsurance);
    setInvestmentReturn(scenario.investmentReturn);
    setYears(scenario.years);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compare renting vs buying
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate the long-term cost of buying a home compared with renting.
          Include mortgage payments, taxes, insurance, maintenance, rent growth,
          home appreciation, selling costs and investment returns.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Better option"
          value={result.betterOption}
          highlight
        />

        <StatCard
          label="Buy net cost"
          value={formatCurrency(result.comparison.buyNetCost, currency)}
        />

        <StatCard
          label="Rent net cost"
          value={formatCurrency(result.comparison.rentNetCost, currency)}
        />
      </div>

      <ToolResultBox title="Buying inputs">
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
              label="Home price"
              value={homePrice}
              onChange={setHomePrice}
              currency={currency}
              helper="Purchase price of the home."
            />

            <MoneyInput
              label="Down payment"
              value={downPayment}
              onChange={setDownPayment}
              currency={currency}
              helper="Cash paid upfront toward the home."
            />

            <PercentInput
              label="Mortgage interest rate"
              value={mortgageRate}
              onChange={setMortgageRate}
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
              helper="Annual property tax as a percentage of home price."
            />

            <MoneyInput
              label="Home insurance"
              value={homeInsurance}
              onChange={setHomeInsurance}
              currency={currency}
              helper="Estimated monthly home insurance."
            />

            <PercentInput
              label="Maintenance"
              value={maintenanceRate}
              onChange={setMaintenanceRate}
              helper="Annual maintenance as a percentage of home price."
            />

            <MoneyInput
              label="HOA fees"
              value={hoaFees}
              onChange={setHoaFees}
              currency={currency}
              helper="Monthly HOA or condo fees."
            />

            <MoneyInput
              label="Closing costs"
              value={closingCosts}
              onChange={setClosingCosts}
              currency={currency}
              helper="One-time buying costs paid upfront."
            />

            <PercentInput
              label="Selling costs"
              value={sellingCostRate}
              onChange={setSellingCostRate}
              helper="Estimated selling costs as a percentage of future home value."
            />

            <PercentInput
              label="Home appreciation"
              value={appreciationRate}
              onChange={setAppreciationRate}
              helper="Expected annual home value growth."
            />

            <NumberInput
              label="Years to compare"
              value={years}
              onChange={setYears}
              suffix="years"
              helper="How long you expect to stay or compare."
            />
          </div>
        </div>
      </ToolResultBox>

      <ToolResultBox title="Renting inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyInput
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            currency={currency}
            helper="Current monthly rent."
          />

          <PercentInput
            label="Annual rent increase"
            value={rentIncreaseRate}
            onChange={setRentIncreaseRate}
            helper="Expected yearly rent growth."
          />

          <MoneyInput
            label="Renter insurance"
            value={renterInsurance}
            onChange={setRenterInsurance}
            currency={currency}
            helper="Estimated monthly renter insurance."
          />

          <PercentInput
            label="Investment return"
            value={investmentReturn}
            onChange={setInvestmentReturn}
            helper="Expected annual return if upfront cash and savings are invested."
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
          Compare rent vs buy
        </button>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {!error && (
        <>
          <ToolResultBox title="Comparison result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Better option"
                value={result.betterOption}
                highlight
              />

              <StatCard
                label="Estimated advantage"
                value={formatCurrency(Math.abs(result.buyAdvantage), currency)}
              />

              <StatCard
                label="Monthly ownership"
                value={formatCurrency(result.monthlyOwnershipCost, currency)}
              />

              <StatCard
                label="Current rent cost"
                value={formatCurrency(result.currentRentCost, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="text-sm font-black text-black">
                {result.betterOption === "Close"
                  ? "The result is close"
                  : `${result.betterOption} looks better in this scenario`}
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                {result.betterOption === "Buy"
                  ? `Buying is estimated to cost ${formatCurrency(
                      Math.abs(result.buyAdvantage),
                      currency
                    )} less over ${formatNumber(result.holdingYears)} years.`
                  : result.betterOption === "Rent"
                    ? `Renting is estimated to cost ${formatCurrency(
                        Math.abs(result.buyAdvantage),
                        currency
                      )} less over ${formatNumber(result.holdingYears)} years after investment gains.`
                    : "The estimated difference is small based on these assumptions."}
              </p>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Buying breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Loan amount"
                value={formatCurrency(result.loanAmount, currency)}
              />

              <StatCard
                label="Mortgage payment"
                value={formatCurrency(result.mortgagePayment, currency)}
              />

              <StatCard
                label="Home value later"
                value={formatCurrency(result.comparison.homeValue, currency)}
              />

              <StatCard
                label="Net sale proceeds"
                value={formatCurrency(
                  result.comparison.netSaleProceeds,
                  currency
                )}
              />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Interest paid"
                value={formatCurrency(result.comparison.interestPaid, currency)}
              />

              <StatCard
                label="Principal paid"
                value={formatCurrency(
                  result.comparison.principalPaid,
                  currency
                )}
              />

              <StatCard
                label="Owner extras"
                value={formatCurrency(
                  result.comparison.totalOwnerExtras,
                  currency
                )}
              />

              <StatCard
                label="Selling costs"
                value={formatCurrency(result.comparison.sellingCosts, currency)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Renting breakdown">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total rent paid"
                value={formatCurrency(result.comparison.totalRentPaid, currency)}
              />

              <StatCard
                label="Investment value"
                value={formatCurrency(
                  result.comparison.investmentBalance,
                  currency
                )}
              />

              <StatCard
                label="Investment gains"
                value={formatCurrency(
                  result.comparison.investmentGains,
                  currency
                )}
              />

              <StatCard
                label="Rent net cost"
                value={formatCurrency(result.comparison.rentNetCost, currency)}
              />
            </div>
          </ToolResultBox>

          <ToolResultBox title="Monthly comparison">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Monthly mortgage"
                value={formatCurrency(result.mortgagePayment, currency)}
              />

              <StatCard
                label="Monthly owner extras"
                value={formatCurrency(result.monthlyOwnerExtras, currency)}
              />

              <StatCard
                label="Monthly difference"
                value={
                  result.monthlyDifference >= 0
                    ? `${formatCurrency(result.monthlyDifference, currency)} more to own`
                    : `${formatCurrency(Math.abs(result.monthlyDifference), currency)} more to rent`
                }
                highlight
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Rent vs buy projection"
            description="Open the projection table to compare estimated net costs at different holding periods."
          >
            <div className="overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-5 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70 sm:grid">
                <div>Years</div>
                <div>Buy net cost</div>
                <div>Rent net cost</div>
                <div>Better</div>
                <div>Difference</div>
              </div>

              <div className="divide-y divide-black/10 bg-white">
                {result.projection.map((row) => (
                  <div
                    key={row.years}
                    className="grid gap-3 px-4 py-4 text-sm sm:grid-cols-5 sm:items-center"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Years
                      </div>
                      <div className="font-bold text-black">{row.years}</div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Buy net cost
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.buyNetCost, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Rent net cost
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.rentNetCost, currency)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Better
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          row.better === "Buy"
                            ? "bg-black text-white"
                            : row.better === "Rent"
                              ? "bg-black/10 text-black"
                              : "bg-[#fff8df] text-black"
                        }`}
                      >
                        {row.better}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-black/40 sm:hidden">
                        Difference
                      </div>
                      <div className="font-bold text-black">
                        {formatCurrency(row.difference, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TogglePanel>
        </>
      )}

      <ToolInfoBox>
        This calculator provides an estimate only. Rent vs buy decisions depend
        on mortgage terms, local taxes, transaction costs, home appreciation,
        investment returns, lifestyle needs and personal financial goals.
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