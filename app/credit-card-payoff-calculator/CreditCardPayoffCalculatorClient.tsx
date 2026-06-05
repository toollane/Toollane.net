"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type PaymentMode = "fixed" | "minimum-plus-extra";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export default function CreditCardPayoffCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(22.9);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("fixed");
  const [fixedMonthlyPayment, setFixedMonthlyPayment] = useState(250);
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState(2);
  const [minimumPaymentFloor, setMinimumPaymentFloor] = useState(35);
  const [extraPayment, setExtraPayment] = useState(100);
  const [newMonthlyCharges, setNewMonthlyCharges] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      balance <= 0 ||
      apr < 0 ||
      fixedMonthlyPayment < 0 ||
      minimumPaymentPercent < 0 ||
      minimumPaymentFloor < 0 ||
      extraPayment < 0 ||
      newMonthlyCharges < 0
    ) {
      return null;
    }

    const monthlyRate = apr / 100 / 12;

    let remainingBalance = balance;
    let months = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    while (remainingBalance > 0.01 && months < 1200) {
      months += 1;

      remainingBalance += newMonthlyCharges;

      const interest = remainingBalance * monthlyRate;
      remainingBalance += interest;
      totalInterest += interest;

      const minimumPayment = Math.max(
        minimumPaymentFloor,
        remainingBalance * (minimumPaymentPercent / 100)
      );

      const plannedPayment =
        paymentMode === "fixed"
          ? fixedMonthlyPayment
          : minimumPayment + extraPayment;

      const payment = Math.min(plannedPayment, remainingBalance);

      if (payment <= interest && remainingBalance > payment) {
        return null;
      }

      remainingBalance -= payment;
      totalPaid += payment;
    }

    if (months >= 1200) {
      return null;
    }

    return {
      payoffMonths: months,
      totalInterest,
      totalPaid,
      totalCost: balance + totalInterest + newMonthlyCharges * months,
      averageMonthlyPayment: totalPaid / months,
    };
  }, [
    balance,
    apr,
    paymentMode,
    fixedMonthlyPayment,
    minimumPaymentPercent,
    minimumPaymentFloor,
    extraPayment,
    newMonthlyCharges,
  ]);

  function validateInputs() {
    if (balance <= 0) {
      setError("Balance must be greater than zero.");
      return false;
    }

    if (
      apr < 0 ||
      fixedMonthlyPayment < 0 ||
      minimumPaymentPercent < 0 ||
      minimumPaymentFloor < 0 ||
      extraPayment < 0 ||
      newMonthlyCharges < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setBalance(5000);
    setApr(22.9);
    setPaymentMode("fixed");
    setFixedMonthlyPayment(250);
    setMinimumPaymentPercent(2);
    setMinimumPaymentFloor(35);
    setExtraPayment(100);
    setNewMonthlyCharges(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate credit card payoff
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate how long it takes to pay off credit card debt using fixed
          payments or minimum payment plus extra payments.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Current balance" value={balance} onChange={setBalance} onBlur={validateInputs} />
          <NumberInput label="APR %" value={apr} onChange={setApr} onBlur={validateInputs} />
          <NumberInput label="New monthly charges" value={newMonthlyCharges} onChange={setNewMonthlyCharges} onBlur={validateInputs} />
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">Payment method</span>

          <select
            value={paymentMode}
            onChange={(event) => setPaymentMode(event.target.value as PaymentMode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="fixed">Fixed monthly payment</option>
            <option value="minimum-plus-extra">
              Minimum payment plus extra
            </option>
          </select>
        </label>

        {paymentMode === "fixed" ? (
          <NumberInput
            label="Fixed monthly payment"
            value={fixedMonthlyPayment}
            onChange={setFixedMonthlyPayment}
            onBlur={validateInputs}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberInput
              label="Minimum payment %"
              value={minimumPaymentPercent}
              onChange={setMinimumPaymentPercent}
              onBlur={validateInputs}
            />

            <NumberInput
              label="Minimum payment floor"
              value={minimumPaymentFloor}
              onChange={setMinimumPaymentFloor}
              onBlur={validateInputs}
            />

            <NumberInput
              label="Extra monthly payment"
              value={extraPayment}
              onChange={setExtraPayment}
              onBlur={validateInputs}
            />
          </div>
        )}

        {error && <ToolErrorBox message={error} />}

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Credit card payoff estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Payoff time"
              value={`${result.payoffMonths} months`}
              highlight
            />

            <ResultCard
              label="Total interest"
              value={formatCurrency(result.totalInterest, currency)}
            />

            <ResultCard
              label="Total paid"
              value={formatCurrency(result.totalPaid, currency)}
            />

            <ResultCard
              label="Average monthly payment"
              value={formatCurrency(result.averageMonthlyPayment, currency)}
            />

            <ResultCard
              label="Estimated total cost"
              value={formatCurrency(result.totalCost, currency)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            At your selected payment plan, payoff takes about{" "}
            <strong className="text-black">
              {result.payoffMonths} months
            </strong>
            , with estimated interest of{" "}
            <strong className="text-black">
              {formatCurrency(result.totalInterest, currency)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Your payment may be too low to reduce the balance. Increase the
          monthly payment or reduce new monthly charges.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Credit card interest is often calculated daily by issuers. This tool
        uses monthly estimates and is intended for planning only.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}