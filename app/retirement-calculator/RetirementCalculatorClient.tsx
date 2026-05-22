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

export default function RetirementCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);

  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");

  const result = useMemo(() => {
    const age = parseFloat(currentAge);
    const retireAge = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings || "0");
    const monthly = parseFloat(monthlyContribution || "0");
    const rate = parseFloat(annualReturn);

    if (
      isNaN(age) ||
      isNaN(retireAge) ||
      isNaN(savings) ||
      isNaN(monthly) ||
      isNaN(rate) ||
      age < 0 ||
      retireAge <= age ||
      savings < 0 ||
      monthly < 0
    ) {
      return {
        yearsToRetirement: "",
        finalBalance: "",
        totalContributions: "",
        investmentGrowth: "",
      };
    }

    const years = retireAge - age;
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;

    let balance = savings;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalContributions = savings + monthly * months;
    const investmentGrowth = balance - totalContributions;

    return {
      yearsToRetirement: years.toFixed(1),
      finalBalance: balance.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      investmentGrowth: investmentGrowth.toFixed(2),
    };
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
  ]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Your Retirement Savings
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how much your retirement savings could grow based on your
          current age, retirement age, monthly contributions and expected return.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Currency
        </label>

        <select
          value={currency.label}
          onChange={(e) => {
            const selected = currencies.find(
              (item) => item.label === e.target.value
            );

            if (selected) {
              setCurrency(selected);
            }
          }}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        >
          {currencies.map((item) => (
            <option key={item.label} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Current Age"
          value={currentAge}
          onChange={setCurrentAge}
          placeholder="35"
          hint="Enter your current age in years."
        />

        <NumberInput
          label="Retirement Age"
          value={retirementAge}
          onChange={setRetirementAge}
          placeholder="65"
          hint="Enter the age when you plan to retire."
        />

        <NumberInput
          label="Current Retirement Savings"
          value={currentSavings}
          onChange={setCurrentSavings}
          placeholder="25000"
        />

        <NumberInput
          label="Monthly Contribution"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          placeholder="500"
        />

        <NumberInput
          label="Expected Annual Return (%)"
          value={annualReturn}
          onChange={setAnnualReturn}
          placeholder="7"
          hint="You can enter decimal returns with a dot or comma, for example 7.5 or 7,5."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Years to Retirement
          </div>

          <div className="text-3xl font-bold">
            {result.yearsToRetirement || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Balance
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.finalBalance || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Contributions
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.totalContributions || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Growth
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}
            {result.investmentGrowth || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          How retirement savings are estimated
        </h3>

        <p className="text-black/60 leading-7">
          This calculator estimates retirement savings using your current
          balance, monthly contributions, time until retirement and expected
          annual return. It is a simplified estimate and does not include taxes,
          inflation or fees.
        </p>
      </div>
    </div>
  );
}