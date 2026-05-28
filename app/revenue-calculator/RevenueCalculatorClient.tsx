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

export default function RevenueCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [unitsSold, setUnitsSold] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");

  const result = useMemo(() => {
    const units = parseFloat(unitsSold);
    const price = parseFloat(pricePerUnit);

    if (
      isNaN(units) ||
      isNaN(price) ||
      units < 0 ||
      price < 0
    ) {
      return {
        revenue: "",
      };
    }

    return {
      revenue: (units * price).toFixed(2),
    };
  }, [unitsSold, pricePerUnit]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Revenue
        </h2>

        <p className="text-black/60 leading-7">
          Estimate revenue by multiplying units sold by price per unit.
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
          label="Units Sold"
          value={unitsSold}
          onChange={setUnitsSold}
          placeholder="1000"
        />

        <NumberInput
          label="Price per Unit"
          value={pricePerUnit}
          onChange={setPricePerUnit}
          placeholder="29.99"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Revenue
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.revenue || "0"}
        </div>
      </div>
    </div>
  );
}