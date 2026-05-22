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

export default function SalesTaxCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [price, setPrice] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const result = useMemo(() => {
    const priceNumber = parseFloat(price);
    const rateNumber = parseFloat(taxRate);

    if (
      isNaN(priceNumber) ||
      isNaN(rateNumber) ||
      priceNumber < 0 ||
      rateNumber < 0
    ) {
      return {
        taxAmount: "",
        totalPrice: "",
      };
    }

    const taxAmount = priceNumber * (rateNumber / 100);
    const totalPrice = priceNumber + taxAmount;

    return {
      taxAmount: taxAmount.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    };
  }, [price, taxRate]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Sales Tax
        </h2>

        <p className="text-black/60 leading-7">
          Calculate sales tax and final price using a custom tax rate.
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
          label="Price Before Tax"
          value={price}
          onChange={setPrice}
          placeholder="100"
        />

        <NumberInput
          label="Sales Tax Rate (%)"
          value={taxRate}
          onChange={setTaxRate}
          placeholder="8.25"
          hint="You can enter decimal tax rates with a dot or comma, for example 8.25 or 8,25."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Tax Amount
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.taxAmount || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Price
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalPrice || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}