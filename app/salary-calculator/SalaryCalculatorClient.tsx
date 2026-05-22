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

export default function SalaryCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [annualSalary, setAnnualSalary] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const result = useMemo(() => {
    const annual = parseFloat(annualSalary);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);

    if (
      isNaN(annual) ||
      isNaN(hours) ||
      isNaN(weeks) ||
      annual < 0 ||
      hours <= 0 ||
      weeks <= 0
    ) {
      return {
        monthly: "",
        weekly: "",
        daily: "",
        hourly: "",
      };
    }

    const monthly = annual / 12;
    const weekly = annual / weeks;
    const daily = weekly / 5;
    const hourly = annual / (hours * weeks);

    return {
      monthly: monthly.toFixed(2),
      weekly: weekly.toFixed(2),
      daily: daily.toFixed(2),
      hourly: hourly.toFixed(2),
    };
  }, [annualSalary, hoursPerWeek, weeksPerYear]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Convert Annual Salary
        </h2>

        <p className="text-black/60 leading-7">
          Convert annual salary into monthly, weekly, daily and hourly pay.
          This calculator uses gross salary before taxes.
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
          label="Annual Salary"
          value={annualSalary}
          onChange={setAnnualSalary}
          placeholder="60000"
        />

        <NumberInput
          label="Hours per Week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          placeholder="40"
          hint="Common full-time schedules use 40 hours per week."
        />

        <NumberInput
          label="Weeks per Year"
          value={weeksPerYear}
          onChange={setWeeksPerYear}
          placeholder="52"
          hint="Use 52 for a full year or adjust for unpaid time off."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Monthly Salary
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.monthly || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Weekly Salary
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.weekly || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Daily Pay
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.daily || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Hourly Rate
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.hourly || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          Gross salary estimate
        </h3>

        <p className="text-black/60 leading-7">
          This calculator converts gross salary before taxes and deductions.
          Country-specific tax, insurance and benefit calculations can vary and
          are not included in this simple estimate.
        </p>
      </div>
    </div>
  );
}