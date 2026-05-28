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

export default function TiktokMoneyCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [views, setViews] = useState("");
  const [rpm, setRpm] = useState("");

  const result = useMemo(() => {
    const viewsNumber = parseFloat(views);
    const rpmNumber = parseFloat(rpm);

    if (
      isNaN(viewsNumber) ||
      isNaN(rpmNumber) ||
      viewsNumber < 0 ||
      rpmNumber < 0
    ) {
      return {
        estimatedRevenue: "",
      };
    }

    const estimatedRevenue = (viewsNumber / 1000) * rpmNumber;

    return {
      estimatedRevenue: estimatedRevenue.toFixed(2),
    };
  }, [views, rpm]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate TikTok Earnings
        </h2>

        <p className="text-black/60 leading-7">
          Estimate potential TikTok earnings based on video views and estimated revenue per thousand views.
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
          label="TikTok Views"
          value={views}
          onChange={setViews}
          placeholder="1000000"
        />

        <NumberInput
          label="Estimated RPM"
          value={rpm}
          onChange={setRpm}
          placeholder="0.50"
          hint="RPM means estimated revenue per 1,000 views. You can enter values like 0.50 or 0,50."
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Estimated Revenue
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.estimatedRevenue || "0"}
        </div>
      </div>
    </div>
  );
}