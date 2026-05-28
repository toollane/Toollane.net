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

export default function PriceIncreaseCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [increasePercent, setIncreasePercent] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(originalPrice);
    const percent = parseFloat(increasePercent);

    if (
      isNaN(price) ||
      isNaN(percent) ||
      price < 0
    ) {
      return {
        increaseAmount: "",
        newPrice: "",
      };
    }

    const increaseAmount = price * (percent / 100);
    const newPrice = price + increaseAmount;

    return {
      increaseAmount: increaseAmount.toFixed(2),
      newPrice: newPrice.toFixed(2),
    };
  }, [originalPrice, increasePercent]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Price Increase
        </h2>

        <p className="text-black/60 leading-7">
          Calculate a new price after applying a percentage increase.
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
          label="Original Price"
          value={originalPrice}
          onChange={setOriginalPrice}
          placeholder="100"
        />

        <NumberInput
          label="Increase (%)"
          value={increasePercent}
          onChange={setIncreasePercent}
          placeholder="10"
          hint="You can enter decimal percentages with a dot or comma, for example 7.5 or 7,5."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Increase Amount
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.increaseAmount || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            New Price
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.newPrice || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}