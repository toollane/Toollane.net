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

export default function CreatorRateCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [hours, setHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [usageFee, setUsageFee] = useState("");
  const [platformFee, setPlatformFee] = useState("");

  const result = useMemo(() => {
    const hoursNumber = parseFloat(hours);
    const rateNumber = parseFloat(hourlyRate);
    const usageNumber = parseFloat(usageFee || "0");
    const platformNumber = parseFloat(platformFee || "0");

    if (
      isNaN(hoursNumber) ||
      isNaN(rateNumber) ||
      isNaN(usageNumber) ||
      isNaN(platformNumber) ||
      hoursNumber < 0 ||
      rateNumber < 0 ||
      usageNumber < 0 ||
      platformNumber < 0
    ) {
      return {
        baseRate: "",
        totalRate: "",
      };
    }

    const baseRate = hoursNumber * rateNumber;
    const totalRate = baseRate + usageNumber + platformNumber;

    return {
      baseRate: baseRate.toFixed(2),
      totalRate: totalRate.toFixed(2),
    };
  }, [hours, hourlyRate, usageFee, platformFee]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Creator Project Rates
        </h2>

        <p className="text-black/60 leading-7">
          Estimate creator project pricing from work hours, hourly rate, usage rights and platform fees.
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
          label="Work Hours"
          value={hours}
          onChange={setHours}
          placeholder="6"
        />

        <NumberInput
          label="Hourly Rate"
          value={hourlyRate}
          onChange={setHourlyRate}
          placeholder="75"
        />

        <NumberInput
          label="Usage Rights Fee"
          value={usageFee}
          onChange={setUsageFee}
          placeholder="300"
          hint="Optional: add a fee for paid usage, licensing or whitelisting."
        />

        <NumberInput
          label="Platform / Production Fee"
          value={platformFee}
          onChange={setPlatformFee}
          placeholder="100"
          hint="Optional: add platform, editing, production or admin fees."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Base Rate
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.baseRate || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Project Rate
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalRate || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}