"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

const currencies = [
  { label: "USD ($)", symbol: "$" },
  { label: "EUR (€)", symbol: "€" },
  { label: "GBP (£)", symbol: "£" },
];

const commonVatRates = ["0", "5", "7", "10", "19", "20", "21"];

export default function VatCalculatorClient() {
  const [mode, setMode] = useState<"add" | "extract">("add");
  const [currency, setCurrency] = useState(currencies[0]);
  const [price, setPrice] = useState("");
  const [vatRate, setVatRate] = useState("20");

  const result = useMemo(() => {
    const priceNumber = parseFloat(price);
    const rateNumber = parseFloat(vatRate);

    if (
      isNaN(priceNumber) ||
      isNaN(rateNumber) ||
      priceNumber < 0 ||
      rateNumber < 0
    ) {
      return {
        netPrice: "",
        vatAmount: "",
        grossPrice: "",
      };
    }

    if (mode === "add") {
      const vatAmount = priceNumber * (rateNumber / 100);
      const grossPrice = priceNumber + vatAmount;

      return {
        netPrice: priceNumber.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        grossPrice: grossPrice.toFixed(2),
      };
    }

    const netPrice = priceNumber / (1 + rateNumber / 100);
    const vatAmount = priceNumber - netPrice;

    return {
      netPrice: netPrice.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      grossPrice: priceNumber.toFixed(2),
    };
  }, [price, vatRate, mode]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate VAT
        </h2>

        <p className="text-black/60 leading-7">
          Add VAT to a net price or extract VAT from a gross price. Choose a currency and enter any VAT rate.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode("add")}
          className={`px-4 py-3 rounded-2xl border transition ${
            mode === "add"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Add VAT
        </button>

        <button
          type="button"
          onClick={() => setMode("extract")}
          className={`px-4 py-3 rounded-2xl border transition ${
            mode === "extract"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Extract VAT
        </button>
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

      <NumberInput
        label={mode === "add" ? "Net Price" : "Gross Price"}
        value={price}
        onChange={setPrice}
        placeholder="100"
      />

      <div>
        <label className="block mb-2 font-medium">
          VAT Rate (%)
        </label>

        <select
          value={vatRate}
          onChange={(e) => setVatRate(e.target.value)}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white mb-3"
        >
          {commonVatRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}%
            </option>
          ))}
        </select>

        <NumberInput
          label="Custom VAT Rate (%)"
          value={vatRate}
          onChange={setVatRate}
          placeholder="20"
          hint="You can enter any VAT rate, for example 19, 20 or 21."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Net Price
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.netPrice || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            VAT Amount
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.vatAmount || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Gross Price
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.grossPrice || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}