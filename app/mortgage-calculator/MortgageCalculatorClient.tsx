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

export default function MortgageCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("30");

  const result = useMemo(() => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment || "0");
    const rate = parseFloat(annualRate);
    const term = parseFloat(years);

    if (
      isNaN(price) ||
      isNaN(down) ||
      isNaN(rate) ||
      isNaN(term) ||
      price <= 0 ||
      down < 0 ||
      down >= price ||
      rate < 0 ||
      term <= 0
    ) {
      return {
        loanAmount: "",
        monthlyPayment: "",
        totalPayment: "",
        totalInterest: "",
      };
    }

    const loanAmount = price - down;
    const months = term * 12;
    const monthlyRate = rate / 100 / 12;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / months;
    } else {
      monthlyPayment =
        (loanAmount *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    return {
      loanAmount: loanAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  }, [homePrice, downPayment, annualRate, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Mortgage Payments
        </h2>

        <p className="text-black/60 leading-7">
          Estimate monthly mortgage payments based on home price, down payment,
          interest rate and loan term.
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
          label="Home Price"
          value={homePrice}
          onChange={setHomePrice}
          placeholder="400000"
        />

        <NumberInput
          label="Down Payment"
          value={downPayment}
          onChange={setDownPayment}
          placeholder="80000"
        />

        <NumberInput
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="6.5"
          hint="You can enter decimal interest rates with a dot or comma, for example 6.5 or 6,5."
        />

        <NumberInput
          label="Loan Term (Years)"
          value={years}
          onChange={setYears}
          placeholder="30"
          hint="Common mortgage terms are 15, 20 or 30 years. You can also enter partial years."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Loan Amount
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.loanAmount || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Monthly Payment
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.monthlyPayment || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Payment
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalPayment || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Interest
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalInterest || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          What this mortgage calculator includes
        </h3>

        <p className="text-black/60 leading-7">
          This calculator estimates principal and interest payments. It does not
          include property taxes, insurance, HOA fees or other local housing
          costs.
        </p>
      </div>
    </div>
  );
}