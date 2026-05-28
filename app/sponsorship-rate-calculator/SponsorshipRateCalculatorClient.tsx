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

export default function SponsorshipRateCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [averageViews, setAverageViews] = useState("");
  const [cpm, setCpm] = useState("");
  const [placements, setPlacements] = useState("1");

  const result = useMemo(() => {
    const views = parseFloat(averageViews);
    const cpmNumber = parseFloat(cpm);
    const placementCount = parseFloat(placements);

    if (
      isNaN(views) ||
      isNaN(cpmNumber) ||
      isNaN(placementCount) ||
      views < 0 ||
      cpmNumber < 0 ||
      placementCount <= 0
    ) {
      return {
        estimatedRate: "",
      };
    }

    const estimatedRate = (views / 1000) * cpmNumber * placementCount;

    return {
      estimatedRate: estimatedRate.toFixed(2),
    };
  }, [averageViews, cpm, placements]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Sponsorship Rates
        </h2>

        <p className="text-black/60 leading-7">
          Estimate sponsorship pricing based on average views, CPM and number of sponsor placements.
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
          label="Average Views"
          value={averageViews}
          onChange={setAverageViews}
          placeholder="50000"
        />

        <NumberInput
          label="Sponsorship CPM"
          value={cpm}
          onChange={setCpm}
          placeholder="25"
          hint="CPM means estimated price per 1,000 views. You can enter values like 25.5 or 25,5."
        />

        <NumberInput
          label="Sponsor Placements"
          value={placements}
          onChange={setPlacements}
          placeholder="1"
          hint="Enter how many sponsor mentions or placements are included."
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Estimated Sponsorship Rate
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}{result.estimatedRate || "0"}
        </div>
      </div>
    </div>
  );
}