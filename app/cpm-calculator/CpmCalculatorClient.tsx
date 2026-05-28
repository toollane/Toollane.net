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

export default function CpmCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [cost, setCost] = useState("");
  const [impressions, setImpressions] = useState("");

  const result = useMemo(() => {
    const costNumber = parseFloat(cost);
    const impressionsNumber = parseFloat(impressions);

    if (
      isNaN(costNumber) ||
      isNaN(impressionsNumber) ||
      costNumber < 0 ||
      impressionsNumber <= 0
    ) {
      return {
        cpm: "",
      };
    }

    return {
      cpm: ((costNumber / impressionsNumber) * 1000).toFixed(2),
    };
  }, [cost, impressions]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate CPM
        </h2>

        <p className="text-black/60 leading-7">
          Calculate cost per thousand impressions for advertising campaigns.
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
          label="Campaign Cost"
          value={cost}
          onChange={setCost}
          placeholder="500"
        />

        <NumberInput
          label="Impressions"
          value={impressions}
          onChange={setImpressions}
          placeholder="100000"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          CPM
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.cpm || "0"}
        </div>
      </div>
    </div>
  );
}