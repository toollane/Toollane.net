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

export default function InflationCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [amount, setAmount] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const value = parseFloat(amount);
    const rate = parseFloat(inflationRate);
    const time = parseFloat(years);

    if (
      isNaN(value) ||
      isNaN(rate) ||
      isNaN(time) ||
      value < 0 ||
      rate < 0 ||
      time <= 0
    ) {
      return {
        futureCost: "",
        increase: "",
      };
    }

    const futureCost = value * Math.pow(1 + rate / 100, time);
    const increase = futureCost - value;

    return {
      futureCost: futureCost.toFixed(2),
      increase: increase.toFixed(2),
    };
  }, [amount, inflationRate, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Future Cost With Inflation
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how much a price may increase over time based on an annual
          inflation rate.
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
          label="Current Amount"
          value={amount}
          onChange={setAmount}
          placeholder="100"
        />

        <NumberInput
          label="Annual Inflation Rate (%)"
          value={inflationRate}
          onChange={setInflationRate}
          placeholder="3"
          hint="You can enter decimal rates with a dot or comma, for example 3.5 or 3,5."
        />

        <NumberInput
          label="Time Period (Years)"
          value={years}
          onChange={setYears}
          placeholder="10"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Future Cost
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.futureCost || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Price Increase
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.increase || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}