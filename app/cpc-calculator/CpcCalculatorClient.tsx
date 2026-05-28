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

export default function CpcCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [cost, setCost] = useState("");
  const [clicks, setClicks] = useState("");

  const result = useMemo(() => {
    const costNumber = parseFloat(cost);
    const clicksNumber = parseFloat(clicks);

    if (
      isNaN(costNumber) ||
      isNaN(clicksNumber) ||
      costNumber < 0 ||
      clicksNumber <= 0
    ) {
      return {
        cpc: "",
      };
    }

    return {
      cpc: (costNumber / clicksNumber).toFixed(2),
    };
  }, [cost, clicks]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate CPC
        </h2>

        <p className="text-black/60 leading-7">
          Calculate cost per click for advertising campaigns and paid traffic.
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
          label="Clicks"
          value={clicks}
          onChange={setClicks}
          placeholder="1000"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          CPC
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.cpc || "0"}
        </div>
      </div>
    </div>
  );
}