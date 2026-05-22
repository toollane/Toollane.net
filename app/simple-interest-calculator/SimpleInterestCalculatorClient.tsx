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

export default function SimpleInterestCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const principalNumber = parseFloat(principal);
    const rateNumber = parseFloat(annualRate);
    const yearsNumber = parseFloat(years);

    if (
      isNaN(principalNumber) ||
      isNaN(rateNumber) ||
      isNaN(yearsNumber) ||
      principalNumber < 0 ||
      rateNumber < 0 ||
      yearsNumber <= 0
    ) {
      return {
        interest: "",
        totalAmount: "",
      };
    }

    const interest =
      principalNumber * (rateNumber / 100) * yearsNumber;

    const totalAmount = principalNumber + interest;

    return {
      interest: interest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  }, [principal, annualRate, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Simple Interest
        </h2>

        <p className="text-black/60 leading-7">
          Calculate simple interest using principal amount, annual interest rate
          and time period.
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
          label="Principal Amount"
          value={principal}
          onChange={setPrincipal}
          placeholder="1000"
        />

        <NumberInput
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="5"
          hint="You can enter decimal interest rates with a dot or comma, for example 5.5 or 5,5."
        />

        <NumberInput
          label="Time Period (Years)"
          value={years}
          onChange={setYears}
          placeholder="3"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Interest Earned
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.interest || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Amount
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalAmount || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          Simple interest formula
        </h3>

        <p className="text-black/60 leading-7">
          Simple interest is calculated by multiplying the principal amount by
          the annual interest rate and the time period. Unlike compound
          interest, simple interest does not earn interest on previous interest.
        </p>
      </div>
    </div>
  );
}