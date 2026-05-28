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

export default function PodcastRevenueCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [downloads, setDownloads] = useState("");
  const [cpm, setCpm] = useState("");
  const [adSlots, setAdSlots] = useState("1");

  const result = useMemo(() => {
    const downloadNumber = parseFloat(downloads);
    const cpmNumber = parseFloat(cpm);
    const slotNumber = parseFloat(adSlots);

    if (
      isNaN(downloadNumber) ||
      isNaN(cpmNumber) ||
      isNaN(slotNumber) ||
      downloadNumber < 0 ||
      cpmNumber < 0 ||
      slotNumber <= 0
    ) {
      return {
        estimatedRevenue: "",
      };
    }

    const estimatedRevenue = (downloadNumber / 1000) * cpmNumber * slotNumber;

    return {
      estimatedRevenue: estimatedRevenue.toFixed(2),
    };
  }, [downloads, cpm, adSlots]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Estimate Podcast Revenue
        </h2>

        <p className="text-black/60 leading-7">
          Estimate podcast ad revenue based on downloads, CPM and number of ad slots.
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
          label="Episode Downloads"
          value={downloads}
          onChange={setDownloads}
          placeholder="50000"
        />

        <NumberInput
          label="CPM"
          value={cpm}
          onChange={setCpm}
          placeholder="25"
          hint="CPM means ad revenue per 1,000 downloads."
        />

        <NumberInput
          label="Ad Slots"
          value={adSlots}
          onChange={setAdSlots}
          placeholder="1"
          hint="Enter how many ad placements are included in the episode."
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