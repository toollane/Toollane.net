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

export default function CommissionCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [salesAmount, setSalesAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  const result = useMemo(() => {
    const sales = parseFloat(salesAmount);
    const rate = parseFloat(commissionRate);

    if (
      isNaN(sales) ||
      isNaN(rate) ||
      sales < 0 ||
      rate < 0
    ) {
      return {
        commission: "",
        total: "",
      };
    }

    const commission = sales * (rate / 100);
    const total = sales + commission;

    return {
      commission: commission.toFixed(2),
      total: total.toFixed(2),
    };
  }, [salesAmount, commissionRate]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Commission
        </h2>

        <p className="text-black/60 leading-7">
          Calculate commission earnings based on sales amount and commission percentage.
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
          label="Sales Amount"
          value={salesAmount}
          onChange={setSalesAmount}
          placeholder="10000"
        />

        <NumberInput
          label="Commission Rate (%)"
          value={commissionRate}
          onChange={setCommissionRate}
          placeholder="10"
          hint="You can enter decimal commission rates with a dot or comma, for example 7.5 or 7,5."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Commission
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.commission || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Sales + Commission
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.total || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}