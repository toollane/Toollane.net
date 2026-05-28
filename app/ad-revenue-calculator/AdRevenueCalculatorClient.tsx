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

export default function AdRevenueCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [pageviews, setPageviews] = useState("");
  const [rpm, setRpm] = useState("");

  const result = useMemo(() => {
    const pageviewsNumber = parseFloat(pageviews);
    const rpmNumber = parseFloat(rpm);

    if (
      isNaN(pageviewsNumber) ||
      isNaN(rpmNumber) ||
      pageviewsNumber < 0 ||
      rpmNumber < 0
    ) {
      return {
        estimatedRevenue: "",
      };
    }

    const estimatedRevenue = (pageviewsNumber / 1000) * rpmNumber;

    return {
      estimatedRevenue: estimatedRevenue.toFixed(2),
    };
  }, [pageviews, rpm]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Ad Revenue
        </h2>

        <p className="text-black/60 leading-7">
          Estimate website, blog or creator ad revenue from pageviews and RPM.
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
          label="Pageviews"
          value={pageviews}
          onChange={setPageviews}
          placeholder="100000"
        />

        <NumberInput
          label="RPM"
          value={rpm}
          onChange={setRpm}
          placeholder="12"
          hint="RPM means revenue per 1,000 pageviews. You can enter values like 12.5 or 12,5."
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Estimated Ad Revenue
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.estimatedRevenue || "0"}
        </div>
      </div>
    </div>
  );
}