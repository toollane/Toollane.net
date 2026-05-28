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

export default function ProfitPerUnitCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [unitsSold, setUnitsSold] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(sellingPrice);
    const cost = parseFloat(unitCost);
    const units = parseFloat(unitsSold || "1");

    if (
      isNaN(price) ||
      isNaN(cost) ||
      isNaN(units) ||
      price < 0 ||
      cost < 0 ||
      units <= 0
    ) {
      return {
        profitPerUnit: "",
        totalProfit: "",
        margin: "",
      };
    }

    const profitPerUnit = price - cost;
    const totalProfit = profitPerUnit * units;
    const margin = price > 0 ? (profitPerUnit / price) * 100 : 0;

    return {
      profitPerUnit: profitPerUnit.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      margin: margin.toFixed(2),
    };
  }, [sellingPrice, unitCost, unitsSold]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Profit Per Unit
        </h2>

        <p className="text-black/60 leading-7">
          Calculate how much profit you make per item and estimate total profit from units sold.
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
          label="Selling Price per Unit"
          value={sellingPrice}
          onChange={setSellingPrice}
          placeholder="29.99"
        />

        <NumberInput
          label="Cost per Unit"
          value={unitCost}
          onChange={setUnitCost}
          placeholder="12.50"
        />

        <NumberInput
          label="Units Sold"
          value={unitsSold}
          onChange={setUnitsSold}
          placeholder="100"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Profit per Unit
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.profitPerUnit || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Profit
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalProfit || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Margin
          </div>

          <div className="text-3xl font-bold">
            {result.margin || "0"}%
          </div>
        </div>
      </div>
    </div>
  );
}