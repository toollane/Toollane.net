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

export default function YoutubeCpmCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [revenue, setRevenue] = useState("");
  const [views, setViews] = useState("");

  const result = useMemo(() => {
    const revenueNumber = parseFloat(revenue);
    const viewsNumber = parseFloat(views);

    if (
      isNaN(revenueNumber) ||
      isNaN(viewsNumber) ||
      revenueNumber < 0 ||
      viewsNumber <= 0
    ) {
      return {
        cpm: "",
      };
    }

    const cpm = (revenueNumber / viewsNumber) * 1000;

    return {
      cpm: cpm.toFixed(2),
    };
  }, [revenue, views]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate YouTube CPM
        </h2>

        <p className="text-black/60 leading-7">
          Calculate estimated YouTube CPM from revenue and video views.
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
          label="Revenue"
          value={revenue}
          onChange={setRevenue}
          placeholder="4000"
        />

        <NumberInput
          label="Views"
          value={views}
          onChange={setViews}
          placeholder="1000000"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          YouTube CPM
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.cpm || "0"}
        </div>
      </div>
    </div>
  );
}