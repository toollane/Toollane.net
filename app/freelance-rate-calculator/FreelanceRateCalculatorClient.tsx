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

export default function FreelanceRateCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [targetIncome, setTargetIncome] = useState("");
  const [businessCosts, setBusinessCosts] = useState("");
  const [billableHoursWeek, setBillableHoursWeek] = useState("");
  const [weeksPerYear, setWeeksPerYear] = useState("46");

  const result = useMemo(() => {
    const income = parseFloat(targetIncome);
    const costs = parseFloat(businessCosts || "0");
    const hours = parseFloat(billableHoursWeek);
    const weeks = parseFloat(weeksPerYear);

    if (
      isNaN(income) ||
      isNaN(costs) ||
      isNaN(hours) ||
      isNaN(weeks) ||
      income <= 0 ||
      costs < 0 ||
      hours <= 0 ||
      weeks <= 0
    ) {
      return {
        hourlyRate: "",
        monthlyTarget: "",
        annualRevenue: "",
      };
    }

    const annualRevenue = income + costs;
    const hourlyRate = annualRevenue / (hours * weeks);
    const monthlyTarget = annualRevenue / 12;

    return {
      hourlyRate: hourlyRate.toFixed(2),
      monthlyTarget: monthlyTarget.toFixed(2),
      annualRevenue: annualRevenue.toFixed(2),
    };
  }, [
    targetIncome,
    businessCosts,
    billableHoursWeek,
    weeksPerYear,
  ]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Your Freelance Rate
        </h2>

        <p className="text-black/60 leading-7">
          Estimate the hourly rate needed to reach your income goal while covering business costs.
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
          label="Target Annual Income"
          value={targetIncome}
          onChange={setTargetIncome}
          placeholder="80000"
        />

        <NumberInput
          label="Annual Business Costs"
          value={businessCosts}
          onChange={setBusinessCosts}
          placeholder="10000"
        />

        <NumberInput
          label="Billable Hours per Week"
          value={billableHoursWeek}
          onChange={setBillableHoursWeek}
          placeholder="25"
        />

        <NumberInput
          label="Working Weeks per Year"
          value={weeksPerYear}
          onChange={setWeeksPerYear}
          placeholder="46"
          hint="Many freelancers use fewer than 52 billable weeks to account for vacation, admin and downtime."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Hourly Rate
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.hourlyRate || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Monthly Revenue Target
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.monthlyTarget || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Annual Revenue Needed
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.annualRevenue || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}