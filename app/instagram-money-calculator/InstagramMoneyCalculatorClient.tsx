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

export default function InstagramMoneyCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [ratePerEngagement, setRatePerEngagement] = useState("");

  const result = useMemo(() => {
    const followerNumber = parseFloat(followers);
    const engagementNumber = parseFloat(engagementRate);
    const rateNumber = parseFloat(ratePerEngagement);

    if (
      isNaN(followerNumber) ||
      isNaN(engagementNumber) ||
      isNaN(rateNumber) ||
      followerNumber < 0 ||
      engagementNumber < 0 ||
      rateNumber < 0
    ) {
      return {
        estimatedEngagements: "",
        estimatedPostValue: "",
      };
    }

    const estimatedEngagements = followerNumber * (engagementNumber / 100);
    const estimatedPostValue = estimatedEngagements * rateNumber;

    return {
      estimatedEngagements: estimatedEngagements.toFixed(0),
      estimatedPostValue: estimatedPostValue.toFixed(2),
    };
  }, [followers, engagementRate, ratePerEngagement]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Instagram Earnings
        </h2>

        <p className="text-black/60 leading-7">
          Estimate potential Instagram post value based on followers,
          engagement rate and value per engagement.
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
          label="Followers"
          value={followers}
          onChange={setFollowers}
          placeholder="50000"
        />

        <NumberInput
          label="Engagement Rate (%)"
          value={engagementRate}
          onChange={setEngagementRate}
          placeholder="3.5"
          hint="You can enter decimal rates with a dot or comma, for example 3.5 or 3,5."
        />

        <NumberInput
          label="Value per Engagement"
          value={ratePerEngagement}
          onChange={setRatePerEngagement}
          placeholder="0.10"
          hint="Enter an estimated value per like, comment or interaction."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Engagements
          </div>

          <div className="text-3xl font-bold">
            {result.estimatedEngagements || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Post Value
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.estimatedPostValue || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}