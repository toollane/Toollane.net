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

export default function AutoLoanCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("60");

  const result = useMemo(() => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment || "0");
    const rate = parseFloat(annualRate);
    const months = parseFloat(loanTerm);

    if (
      isNaN(price) ||
      isNaN(down) ||
      isNaN(rate) ||
      isNaN(months) ||
      price <= 0 ||
      down < 0 ||
      down >= price ||
      rate < 0 ||
      months <= 0
    ) {
      return {
        loanAmount: "",
        monthlyPayment: "",
        totalPayment: "",
        totalInterest: "",
      };
    }

    const loanAmount = price - down;
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
  }, [vehiclePrice, downPayment, annualRate, loanTerm]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Auto Loan Payments
        </h2>

        <p className="text-black/60 leading-7">
          Estimate monthly car payments, total repayment and interest based on vehicle price, down payment, loan term and interest rate.
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
          label="Vehicle Price"
          value={vehiclePrice}
          onChange={setVehiclePrice}
          placeholder="30000"
        />

        <NumberInput
          label="Down Payment"
          value={downPayment}
          onChange={setDownPayment}
          placeholder="5000"
        />

        <NumberInput
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="6.5"
          hint="You can enter decimal interest rates with a dot or comma, for example 6.5 or 6,5."
        />

        <NumberInput
          label="Loan Term (Months)"
          value={loanTerm}
          onChange={setLoanTerm}
          placeholder="60"
          hint="Common auto loan terms are 36, 48, 60 or 72 months."
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
    </div>
  );
}