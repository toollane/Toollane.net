"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function CompoundInterestCalculatorClient() {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const principal = parseFloat(initialAmount || "0");
    const monthly = parseFloat(monthlyContribution || "0");
    const rate = parseFloat(annualRate);
    const time = parseFloat(years);

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
        finalAmount: "",
        totalContributions: "",
        totalInterest: "",
      };
    }

    const monthlyRate = rate / 100 / 12;
    const months = time * 12;

    let balance = principal;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalContributions = principal + monthly * months;
    const totalInterest = balance - totalContributions;

    return {
      finalAmount: balance.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  }, [
    initialAmount,
    monthlyContribution,
    annualRate,
    years,
  ]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Compound Growth
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how your money may grow over time with compound interest,
          monthly contributions and an annual interest rate.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Initial Amount (USD)"
          value={initialAmount}
          onChange={setInitialAmount}
          placeholder="1000"
        />

        <NumberInput
          label="Monthly Contribution (USD)"
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          placeholder="100"
        />

        <NumberInput
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="7"
          hint="You can enter decimal interest rates with a dot or comma, for example 7.5 or 7,5."
        />

        <NumberInput
          label="Time Period (Years)"
          value={years}
          onChange={setYears}
          placeholder="10"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Final Amount
          </div>

          <div className="text-3xl font-bold">
            ${result.finalAmount || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Contributions
          </div>

          <div className="text-3xl font-bold">
            ${result.totalContributions || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Interest Earned
          </div>

          <div className="text-3xl font-bold">
            ${result.totalInterest || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          How compound interest works
        </h3>

        <p className="text-black/60 leading-7">
          Compound interest means your interest earns additional interest over
          time. The longer the time period and the more often you contribute,
          the stronger the compounding effect can become.
        </p>
      </div>
    </div>
  );
}