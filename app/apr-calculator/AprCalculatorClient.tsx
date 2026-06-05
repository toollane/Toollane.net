"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function AprCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(8);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [originationFee, setOriginationFee] = useState(300);
  const [applicationFee, setApplicationFee] = useState(50);
  const [otherFees, setOtherFees] = useState(100);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      loanAmount <= 0 ||
      interestRate < 0 ||
      loanTermMonths <= 0 ||
      originationFee < 0 ||
      applicationFee < 0 ||
      otherFees < 0
    ) {
      return null;
    }

    const monthlyRate = interestRate / 100 / 12;

    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / loanTermMonths
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
          (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

    const totalFees = originationFee + applicationFee + otherFees;
    const amountReceived = loanAmount - totalFees;
    const totalPaid = monthlyPayment * loanTermMonths;
    const totalInterest = totalPaid - loanAmount;
    const totalCost = totalInterest + totalFees;

    let low = 0;
    let high = 1;

    for (let i = 0; i < 100; i++) {
      const mid = (low + high) / 2;
      const presentValue =
        monthlyPayment *
        ((1 - Math.pow(1 + mid, -loanTermMonths)) / mid);

      if (presentValue > amountReceived) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const apr = low * 12 * 100;

    return {
      monthlyPayment,
      totalFees,
      amountReceived,
      totalInterest,
      totalCost,
      totalPaid,
      apr,
    };
  }, [
    loanAmount,
    interestRate,
    loanTermMonths,
    originationFee,
    applicationFee,
    otherFees,
  ]);

  function validateInputs() {
    if (loanAmount <= 0 || loanTermMonths <= 0) {
      setError("Loan amount and loan term must be greater than zero.");
      return false;
    }

    if (
      interestRate < 0 ||
      originationFee < 0 ||
      applicationFee < 0 ||
      otherFees < 0
    ) {
      setError("Rates and fees cannot be negative.");
      return false;
    }

    if (originationFee + applicationFee + otherFees >= loanAmount) {
      setError("Total fees must be lower than the loan amount.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setLoanAmount(10000);
    setInterestRate(8);
    setLoanTermMonths(36);
    setOriginationFee(300);
    setApplicationFee(50);
    setOtherFees(100);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate APR
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate annual percentage rate from loan amount, interest rate, term
          and upfront fees.
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
          <NumberInput label="Loan amount" value={loanAmount} onChange={setLoanAmount} onBlur={validateInputs} />
          <NumberInput label="Interest rate %" value={interestRate} onChange={setInterestRate} onBlur={validateInputs} />
          <NumberInput label="Loan term months" value={loanTermMonths} onChange={setLoanTermMonths} onBlur={validateInputs} />
          <NumberInput label="Origination fee" value={originationFee} onChange={setOriginationFee} onBlur={validateInputs} />
          <NumberInput label="Application fee" value={applicationFee} onChange={setApplicationFee} onBlur={validateInputs} />
          <NumberInput label="Other fees" value={otherFees} onChange={setOtherFees} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="APR estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="APR" value={formatPercent(result.apr)} highlight />
            <ResultCard label="Monthly payment" value={formatCurrency(result.monthlyPayment, currency)} />
            <ResultCard label="Amount received" value={formatCurrency(result.amountReceived, currency)} />
            <ResultCard label="Total fees" value={formatCurrency(result.totalFees, currency)} />
            <ResultCard label="Total interest" value={formatCurrency(result.totalInterest, currency)} />
            <ResultCard label="Total cost" value={formatCurrency(result.totalCost, currency)} />
            <ResultCard label="Total paid" value={formatCurrency(result.totalPaid, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid loan values to estimate APR.
        </ToolInfoBox>
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange, onBlur }: { label: string; value: number; onChange: (value: number) => void; onBlur: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}