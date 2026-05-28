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

export default function NewsletterRevenueCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [subscribers, setSubscribers] = useState("");
  const [openRate, setOpenRate] = useState("");
  const [sponsorCpm, setSponsorCpm] = useState("");

  const result = useMemo(() => {
    const subscriberNumber = parseFloat(subscribers);
    const openRateNumber = parseFloat(openRate);
    const cpmNumber = parseFloat(sponsorCpm);

    if (
      isNaN(subscriberNumber) ||
      isNaN(openRateNumber) ||
      isNaN(cpmNumber) ||
      subscriberNumber < 0 ||
      openRateNumber < 0 ||
      cpmNumber < 0
    ) {
      return {
        estimatedOpens: "",
        estimatedRevenue: "",
      };
    }

    const estimatedOpens = subscriberNumber * (openRateNumber / 100);
    const estimatedRevenue = (estimatedOpens / 1000) * cpmNumber;

    return {
      estimatedOpens: estimatedOpens.toFixed(0),
      estimatedRevenue: estimatedRevenue.toFixed(2),
    };
  }, [subscribers, openRate, sponsorCpm]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Newsletter Revenue
        </h2>

        <p className="text-black/60 leading-7">
          Estimate newsletter sponsorship revenue from subscribers, open rate and sponsor CPM.
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
          label="Subscribers"
          value={subscribers}
          onChange={setSubscribers}
          placeholder="25000"
        />

        <NumberInput
          label="Open Rate (%)"
          value={openRate}
          onChange={setOpenRate}
          placeholder="40"
          hint="You can enter decimal open rates with a dot or comma, for example 42.5 or 42,5."
        />

        <NumberInput
          label="Sponsor CPM"
          value={sponsorCpm}
          onChange={setSponsorCpm}
          placeholder="50"
          hint="Sponsor CPM means estimated sponsor price per 1,000 opens."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Opens
          </div>

          <div className="text-3xl font-bold">
            {result.estimatedOpens || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Sponsorship Revenue
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.estimatedRevenue || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}