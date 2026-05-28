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

export default function UnitPriceCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [totalPrice, setTotalPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(totalPrice);
    const qty = parseFloat(quantity);

    if (
      isNaN(price) ||
      isNaN(qty) ||
      price < 0 ||
      qty <= 0
    ) {
      return {
        unitPrice: "",
      };
    }

    return {
      unitPrice: (price / qty).toFixed(2),
    };
  }, [totalPrice, quantity]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Unit Price
        </h2>

        <p className="text-black/60 leading-7">
          Compare prices by calculating the cost per unit from total price and quantity.
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
          label="Total Price"
          value={totalPrice}
          onChange={setTotalPrice}
          placeholder="12.99"
        />

        <NumberInput
          label="Quantity"
          value={quantity}
          onChange={setQuantity}
          placeholder="6"
          hint="Enter the number of units, items, ounces, grams or any comparable quantity."
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Unit Price
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.unitPrice || "0"} per unit
        </div>
      </div>
    </div>
  );
}