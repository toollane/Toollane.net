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

export default function SalaryToHourlyCalculatorClient() {
  const [currency, setCurrency] =
    useState(currencies[0]);

  const [salary, setSalary] =
    useState("");

  const [hoursPerWeek, setHoursPerWeek] =
    useState("40");

  const result = useMemo(() => {
    const salaryNumber =
      parseFloat(salary);

    const hoursNumber =
      parseFloat(hoursPerWeek);

    if (
      isNaN(salaryNumber) ||
      isNaN(hoursNumber) ||
      salaryNumber < 0 ||
      hoursNumber <= 0
    ) {
      return {
        hourlyRate: "",
      };
    }

    const hourlyRate =
      salaryNumber /
      (hoursNumber * 52);

    return {
      hourlyRate:
        hourlyRate.toFixed(2),
    };
  }, [salary, hoursPerWeek]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Convert Salary to Hourly Pay
        </h2>

        <p className="text-black/60 leading-7">
          Estimate hourly wage based on annual salary and weekly work hours.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Currency
        </label>

        <select
          value={currency.label}
          onChange={(e) => {
            const selected =
              currencies.find(
                (item) =>
                  item.label ===
                  e.target.value
              );

            if (selected) {
              setCurrency(selected);
            }
          }}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        >
          {currencies.map((item) => (
            <option
              key={item.label}
              value={item.label}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Annual Salary"
          value={salary}
          onChange={setSalary}
          placeholder="60000"
        />

        <NumberInput
          label="Hours per Week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          placeholder="40"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Hourly Rate
        </div>

        <div className="text-3xl font-bold">
          {currency.symbol}
          {result.hourlyRate ||
            "0"}
        </div>
      </div>
    </div>
  );
}