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

export default function PaybackPeriodCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [initialInvestment, setInitialInvestment] = useState("");
  const [annualCashFlow, setAnnualCashFlow] = useState("");

  const result = useMemo(() => {
    const investment = parseFloat(initialInvestment);
    const cashFlow = parseFloat(annualCashFlow);

    if (
      isNaN(investment) ||
      isNaN(cashFlow) ||
      investment <= 0 ||
      cashFlow <= 0
    ) {
      return {
        years: "",
        months: "",
      };
    }

    const years = investment / cashFlow;
    const months = years * 12;

    return {
      years: years.toFixed(2),
      months: months.toFixed(1),
    };
  }, [initialInvestment, annualCashFlow]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Payback Period
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how long it takes to recover an initial investment based on
          expected annual cash flow.
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
          label="Initial Investment"
          value={initialInvestment}
          onChange={setInitialInvestment}
          placeholder="10000"
        />

        <NumberInput
          label="Annual Cash Flow"
          value={annualCashFlow}
          onChange={setAnnualCashFlow}
          placeholder="2500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Payback Period
          </div>

          <div className="text-3xl font-bold">
            {result.years || "0"} years
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Equivalent Months
          </div>

          <div className="text-3xl font-bold">
            {result.months || "0"} months
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          Payback period formula
        </h3>

        <p className="text-black/60 leading-7">
          Payback period is calculated by dividing the initial investment by the
          expected annual cash flow. It estimates how long it may take to recover
          the original investment.
        </p>
      </div>
    </div>
  );
}