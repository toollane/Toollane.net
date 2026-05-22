"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

const currencies = [
  { label: "USD ($)", symbol: "$" },
  { label: "EUR (€)", symbol: "€" },
  { label: "GBP (£)", symbol: "£" },
  { label: "CAD ($)", symbol: "$" },
  { label: "AUD ($)", symbol: "$" },
];

export default function InvestmentCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);

  const [initialInvestment, setInitialInvestment] =
    useState("");

  const [monthlyContribution, setMonthlyContribution] =
    useState("");

  const [annualReturn, setAnnualReturn] =
    useState("");

  const [years, setYears] =
    useState("");

  const result = useMemo(() => {
    const principal =
      parseFloat(initialInvestment || "0");

    const monthly =
      parseFloat(monthlyContribution || "0");

    const rate =
      parseFloat(annualReturn);

    const time =
      parseFloat(years);

    if (
      isNaN(principal) ||
      isNaN(monthly) ||
      isNaN(rate) ||
      isNaN(time) ||
      principal < 0 ||
      monthly < 0 ||
      time <= 0
    ) {
      return {
        finalValue: "",
        contributions: "",
        investmentGrowth: "",
      };
    }

    const monthlyRate =
      rate / 100 / 12;

    const months =
      time * 12;

    let balance = principal;

    for (let i = 0; i < months; i++) {
      balance =
        balance * (1 + monthlyRate) +
        monthly;
    }

    const contributions =
      principal + monthly * months;

    const investmentGrowth =
      balance - contributions;

    return {
      finalValue:
        balance.toFixed(2),

      contributions:
        contributions.toFixed(2),

      investmentGrowth:
        investmentGrowth.toFixed(2),
    };
  }, [
    initialInvestment,
    monthlyContribution,
    annualReturn,
    years,
  ]);

  return (
    <div className="grid gap-8">

      {/* INTRO */}

      <div className="space-y-3">

        <h2 className="text-2xl font-bold">
          Calculate Investment Growth
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how your investments may grow over time with recurring contributions and compound returns.
        </p>

      </div>



      {/* CURRENCY */}

      <div>

        <label className="block mb-2 font-medium">
          Currency
        </label>

        <select
          value={currency.label}
          onChange={(e) => {
            const selected =
              currencies.find(
                (item) =>
                  item.label ===
                  e.target.value
              );

            if (selected) {
              setCurrency(selected);
            }
          }}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        >

          {currencies.map((item) => (
            <option
              key={item.label}
              value={item.label}
            >
              {item.label}
            </option>
          ))}

        </select>

      </div>



      {/* INPUTS */}

      <div className="grid gap-6">

        <NumberInput
          label="Initial Investment"
          value={initialInvestment}
          onChange={
            setInitialInvestment
          }
          placeholder="10000"
        />

        <NumberInput
          label="Monthly Contribution"
          value={monthlyContribution}
          onChange={
            setMonthlyContribution
          }
          placeholder="500"
        />

        <NumberInput
          label="Expected Annual Return (%)"
          value={annualReturn}
          onChange={
            setAnnualReturn
          }
          placeholder="8"
          hint="You can enter decimal returns with a dot or comma, for example 7.5 or 7,5."
        />

        <NumberInput
          label="Investment Period (Years)"
          value={years}
          onChange={setYears}
          placeholder="20"
          hint="You can enter full or partial years, for example 2.5 years."
        />

      </div>



      {/* RESULTS */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Final Value
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.finalValue || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Contributions
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.contributions || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Investment Growth
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.investmentGrowth || "0"}
          </div>

        </div>

      </div>



      {/* INFO */}

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">

        <h3 className="font-semibold mb-3">
          How investment growth works
        </h3>

        <p className="text-black/60 leading-7">
          Investment growth depends on your starting balance, recurring contributions, expected return and investment duration. Long-term investing and compounding can significantly increase portfolio growth over time.
        </p>

      </div>

    </div>
  );
}