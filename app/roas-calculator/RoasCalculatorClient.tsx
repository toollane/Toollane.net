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

export default function RoasCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [revenue, setRevenue] = useState("");
  const [adSpend, setAdSpend] = useState("");

  const result = useMemo(() => {
    const revenueNumber = parseFloat(revenue);
    const spendNumber = parseFloat(adSpend);

    if (
      isNaN(revenueNumber) ||
      isNaN(spendNumber) ||
      revenueNumber < 0 ||
      spendNumber <= 0
    ) {
      return {
        roas: "",
        profitBeforeCosts: "",
      };
    }

    return {
      roas: (revenueNumber / spendNumber).toFixed(2),
      profitBeforeCosts: (revenueNumber - spendNumber).toFixed(2),
    };
  }, [revenue, adSpend]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate ROAS
        </h2>

        <p className="text-black/60 leading-7">
          Calculate return on ad spend from revenue and advertising cost.
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
          label="Revenue from Ads"
          value={revenue}
          onChange={setRevenue}
          placeholder="5000"
        />

        <NumberInput
          label="Ad Spend"
          value={adSpend}
          onChange={setAdSpend}
          placeholder="1000"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            ROAS
          </div>

          <div className="text-3xl font-bold">
            {result.roas || "0"}x
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Revenue minus Ad Spend
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.profitBeforeCosts || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}