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

export default function AprCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [loanAmount, setLoanAmount] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const loan = parseFloat(loanAmount);
    const fees = parseFloat(totalFees || "0");
    const rate = parseFloat(interestRate);
    const time = parseFloat(years);

    if (
      isNaN(loan) ||
      isNaN(fees) ||
      isNaN(rate) ||
      isNaN(time) ||
      loan <= 0 ||
      fees < 0 ||
      rate < 0 ||
      time <= 0
    ) {
      return {
        estimatedApr: "",
        totalCost: "",
      };
    }

    const feeRate = (fees / loan / time) * 100;
    const estimatedApr = rate + feeRate;
    const totalCost = fees + loan * (rate / 100) * time;

    return {
      estimatedApr: estimatedApr.toFixed(2),
      totalCost: totalCost.toFixed(2),
    };
  }, [loanAmount, totalFees, interestRate, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate APR
        </h2>

        <p className="text-black/60 leading-7">
          Estimate annual percentage rate using loan amount, fees, interest rate and loan term.
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
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="10000"
        />

        <NumberInput
          label="Total Fees"
          value={totalFees}
          onChange={setTotalFees}
          placeholder="300"
        />

        <NumberInput
          label="Interest Rate (%)"
          value={interestRate}
          onChange={setInterestRate}
          placeholder="6.5"
          hint="You can enter decimal rates with a dot or comma, for example 6.5 or 6,5."
        />

        <NumberInput
          label="Loan Term (Years)"
          value={years}
          onChange={setYears}
          placeholder="5"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated APR
          </div>

          <div className="text-3xl font-bold">
            {result.estimatedApr || "0"}%
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Cost
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalCost || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}