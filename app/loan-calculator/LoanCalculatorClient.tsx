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

export default function LoanCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [loanAmount, setLoanAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(annualRate);
    const time = parseFloat(years);

    if (
      isNaN(principal) ||
      isNaN(rate) ||
      isNaN(time) ||
      principal <= 0 ||
      rate < 0 ||
      time <= 0
    ) {
      return {
        monthlyPayment: "",
        totalPayment: "",
        totalInterest: "",
      };
    }

    const months = time * 12;
    const monthlyRate = rate / 100 / 12;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  }, [loanAmount, annualRate, years]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Loan Payments
        </h2>

        <p className="text-black/60 leading-7">
          Estimate monthly loan payments, total repayment and total interest
          based on loan amount, interest rate and repayment term.
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
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          placeholder="25000"
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
          placeholder="5"
          hint="You can enter full or partial years, for example 2.5 years."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
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
          How loan payments are calculated
        </h3>

        <p className="text-black/60 leading-7">
          The calculator estimates the fixed monthly payment needed to repay a
          loan over the selected term. The result depends on the loan amount,
          interest rate and repayment duration.
        </p>
      </div>
    </div>
  );
}