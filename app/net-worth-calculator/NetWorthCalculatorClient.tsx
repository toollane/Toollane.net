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

export default function NetWorthCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [cash, setCash] = useState("");
  const [investments, setInvestments] = useState("");
  const [property, setProperty] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [debts, setDebts] = useState("");

  const result = useMemo(() => {
    const cashValue = parseFloat(cash || "0");
    const investmentValue = parseFloat(investments || "0");
    const propertyValue = parseFloat(property || "0");
    const otherAssetValue = parseFloat(otherAssets || "0");
    const debtValue = parseFloat(debts || "0");

    const totalAssets =
      cashValue + investmentValue + propertyValue + otherAssetValue;

    const netWorth = totalAssets - debtValue;

    return {
      totalAssets: totalAssets.toFixed(2),
      totalDebts: debtValue.toFixed(2),
      netWorth: netWorth.toFixed(2),
    };
  }, [cash, investments, property, otherAssets, debts]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Net Worth
        </h2>

        <p className="text-black/60 leading-7">
          Add your assets and subtract your debts to estimate your net worth.
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
          label="Cash & Bank Accounts"
          value={cash}
          onChange={setCash}
          placeholder="5000"
        />

        <NumberInput
          label="Investments"
          value={investments}
          onChange={setInvestments}
          placeholder="25000"
        />

        <NumberInput
          label="Property Value"
          value={property}
          onChange={setProperty}
          placeholder="300000"
        />

        <NumberInput
          label="Other Assets"
          value={otherAssets}
          onChange={setOtherAssets}
          placeholder="10000"
        />

        <NumberInput
          label="Total Debts"
          value={debts}
          onChange={setDebts}
          placeholder="150000"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Assets
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalAssets}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Debts
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalDebts}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Net Worth
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.netWorth}
          </div>
        </div>
      </div>
    </div>
  );
}