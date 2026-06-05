"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function LoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [annualRate, setAnnualRate] = useState(7.5);
  const [loanYears, setLoanYears] = useState(5);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      loanAmount <= 0 ||
      annualRate < 0 ||
      loanYears <= 0 ||
      extraMonthlyPayment < 0
    ) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = loanYears * 12;

    const baseMonthlyPayment =
      monthlyRate === 0
        ? loanAmount / totalMonths
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const monthlyPayment = baseMonthlyPayment + extraMonthlyPayment;

    let balance = loanAmount;
    let months = 0;
    let totalPaid = 0;

    while (balance > 0 && months < 1200) {
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, balance);

      if (principal <= 0) {
        return null;
      }

      balance -= principal;
      totalPaid += principal + interest;
      months += 1;
    }

    const totalInterest = totalPaid - loanAmount;

    return {
      baseMonthlyPayment,
      monthlyPayment,
      payoffMonths: months,
      totalPaid,
      totalInterest,
    };
  }, [loanAmount, annualRate, loanYears, extraMonthlyPayment]);

  function validateInputs() {
    if (loanAmount <= 0) {
      setError("Loan amount must be greater than zero.");
      return false;
    }

    if (annualRate < 0) {
      setError("Interest rate cannot be negative.");
      return false;
    }

    if (loanYears <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    if (extraMonthlyPayment < 0) {
      setError("Extra monthly payment cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setLoanAmount(25000);
    setAnnualRate(7.5);
    setLoanYears(5);
    setExtraMonthlyPayment(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate loan payments
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate monthly loan payments, total interest and payoff time for
          personal loans, auto loans and other fixed-rate loans.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput
            label="Loan amount"
            value={loanAmount}
            onChange={setLoanAmount}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Annual interest rate %"
            value={annualRate}
            onChange={setAnnualRate}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Loan term years"
            value={loanYears}
            onChange={setLoanYears}
            onBlur={validateInputs}
          />

          <NumberInput
            label="Extra monthly payment"
            value={extraMonthlyPayment}
            onChange={setExtraMonthlyPayment}
            onBlur={validateInputs}
          />
        </div>

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
        <ToolResultBox title="Loan estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Monthly payment"
              value={formatCurrency(result.monthlyPayment)}
              highlight
            />

            <ResultCard
              label="Base payment"
              value={formatCurrency(result.baseMonthlyPayment)}
            />

            <ResultCard
              label="Total interest"
              value={formatCurrency(result.totalInterest)}
            />

            <ResultCard
              label="Total paid"
              value={formatCurrency(result.totalPaid)}
            />

            <ResultCard
              label="Payoff time"
              value={`${result.payoffMonths} months`}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated monthly payment:{" "}
            <strong className="text-black">
              {formatCurrency(result.monthlyPayment)}
            </strong>
            . Total estimated interest:{" "}
            <strong className="text-black">
              {formatCurrency(result.totalInterest)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid loan details. If your extra payment is too low to cover
          monthly interest, the loan cannot be paid off.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual loan payments may vary
        based on lender fees, taxes, insurance and loan terms.
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