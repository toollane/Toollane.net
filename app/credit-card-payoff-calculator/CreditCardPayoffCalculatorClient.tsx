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

export default function CreditCardPayoffCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [balance, setBalance] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

  const result = useMemo(() => {
    const debt = parseFloat(balance);
    const rate = parseFloat(annualRate);
    const payment = parseFloat(monthlyPayment);

    if (
      isNaN(debt) ||
      isNaN(rate) ||
      isNaN(payment) ||
      debt <= 0 ||
      rate < 0 ||
      payment <= 0
    ) {
      return {
        months: "",
        years: "",
        totalInterest: "",
        totalPaid: "",
        warning: "",
      };
    }

    let remaining = debt;
    let months = 0;
    let totalInterest = 0;
    const monthlyRate = rate / 100 / 12;

    if (payment <= remaining * monthlyRate) {
      return {
        months: "",
        years: "",
        totalInterest: "",
        totalPaid: "",
        warning:

      };
    }

    while (remaining > 0 && months < 1200) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      remaining = remaining + interest - payment;
      months++;
    }

    const totalPaid = debt + totalInterest;

    return {
      months: months.toString(),
      years: (months / 12).toFixed(1),
      totalInterest: totalInterest.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      warning: "",
    };
  }, [balance, annualRate, monthlyPayment]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Credit Card Payoff Time
        </h2>

        <p className="text-black/60 leading-7">
          Estimate how long it may take to pay off a credit card balance based
          on interest rate and monthly payment.
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
          label="Credit Card Balance"
          value={balance}
          onChange={setBalance}
          placeholder="5000"
        />

        <NumberInput
          label="Annual Interest Rate (%)"
          value={annualRate}
          onChange={setAnnualRate}
          placeholder="22.5"
          hint="You can enter decimal rates with a dot or comma, for example 22.5 or 22,5."
        />

        <NumberInput
          label="Monthly Payment"
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          placeholder="250"
        />
      </div>

      {result.warning && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 text-black/70">
          {result.warning}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Payoff Time</div>
          <div className="text-3xl font-bold">
            {result.months || "0"} months
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Years</div>
          <div className="text-3xl font-bold">
            {result.years || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Total Interest</div>
          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalInterest || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">Total Paid</div>
          <div className="text-3xl font-bold">
            {currency.symbol}{result.totalPaid || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}