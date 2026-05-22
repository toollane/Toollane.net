"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function SavingsCalculatorClient() {
  const [initialSavings, setInitialSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const initial = parseFloat(initialSavings || "0");
    const monthly = parseFloat(monthlySavings || "0");
    const time = parseFloat(years);

    if (
      isNaN(initial) ||
      isNaN(monthly) ||
      isNaN(time) ||
      time <= 0
    ) {
      return {
        totalSaved: "",
        totalContributions: "",
      };
    }

    const months = time * 12;
    const totalContributions = monthly * months;
    const totalSaved = initial + totalContributions;

    return {
      totalSaved: totalSaved.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
    };
  }, [initialSavings, monthlySavings, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Your Savings Growth
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how much you can save over time based on your starting
          amount, monthly savings and time period.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Initial Savings (USD)"
          value={initialSavings}
          onChange={setInitialSavings}
          placeholder="1000"
        />

        <NumberInput
          label="Monthly Savings (USD)"
          value={monthlySavings}
          onChange={setMonthlySavings}
          placeholder="250"
        />

        <NumberInput
          label="Time Period (Years)"
          value={years}
          onChange={setYears}
          placeholder="5"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Saved
          </div>

          <div className="text-3xl font-bold">
            ${result.totalSaved || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Contributions Added
          </div>

          <div className="text-3xl font-bold">
            ${result.totalContributions || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}