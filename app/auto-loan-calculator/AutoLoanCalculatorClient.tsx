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

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function AutoLoanCalculatorClient() {
  const [vehiclePrice, setVehiclePrice] = useState(32000);
  const [downPayment, setDownPayment] = useState(4000);
  const [tradeInValue, setTradeInValue] = useState(2500);
  const [rebate, setRebate] = useState(1000);
  const [salesTaxRate, setSalesTaxRate] = useState(7.5);
  const [fees, setFees] = useState(750);
  const [interestRate, setInterestRate] = useState(6.9);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      vehiclePrice <= 0 ||
      downPayment < 0 ||
      tradeInValue < 0 ||
      rebate < 0 ||
      salesTaxRate < 0 ||
      fees < 0 ||
      interestRate < 0 ||
      loanTermMonths <= 0 ||
      extraMonthlyPayment < 0
    ) {
      return null;
    }

    const taxableAmount = Math.max(0, vehiclePrice - tradeInValue - rebate);
    const salesTax = taxableAmount * (salesTaxRate / 100);
    const totalVehicleCost = vehiclePrice + salesTax + fees;
    const loanAmount = Math.max(
      0,
      totalVehicleCost - downPayment - tradeInValue - rebate
    );

    if (loanAmount <= 0) {
      return null;
    }

    const monthlyRate = interestRate / 100 / 12;

    const baseMonthlyPayment =
      monthlyRate === 0
        ? loanAmount / loanTermMonths
        : (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, loanTermMonths)) /
          (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

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
    const totalOutOfPocket = totalPaid + downPayment;

    return {
      taxableAmount,
      salesTax,
      totalVehicleCost,
      loanAmount,
      baseMonthlyPayment,
      monthlyPayment,
      totalInterest,
      totalPaid,
      totalOutOfPocket,
      payoffMonths: months,
      effectiveDownPaymentRate: (downPayment / vehiclePrice) * 100,
    };
  }, [
    vehiclePrice,
    downPayment,
    tradeInValue,
    rebate,
    salesTaxRate,
    fees,
    interestRate,
    loanTermMonths,
    extraMonthlyPayment,
  ]);

  function validateInputs() {
    if (vehiclePrice <= 0) {
      setError("Vehicle price must be greater than zero.");
      return false;
    }

    if (downPayment < 0 || tradeInValue < 0 || rebate < 0) {
      setError("Down payment, trade-in value and rebate cannot be negative.");
      return false;
    }

    if (salesTaxRate < 0 || fees < 0 || interestRate < 0) {
      setError("Tax, fees and interest rate cannot be negative.");
      return false;
    }

    if (loanTermMonths <= 0) {
      setError("Loan term must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setVehiclePrice(32000);
    setDownPayment(4000);
    setTradeInValue(2500);
    setRebate(1000);
    setSalesTaxRate(7.5);
    setFees(750);
    setInterestRate(6.9);
    setLoanTermMonths(60);
    setExtraMonthlyPayment(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate auto loan payments
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate your monthly car payment with vehicle price, down payment,
          trade-in value, rebates, sales tax, fees, interest and loan term.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Vehicle price" value={vehiclePrice} onChange={setVehiclePrice} onBlur={validateInputs} />
          <NumberInput label="Down payment" value={downPayment} onChange={setDownPayment} onBlur={validateInputs} />
          <NumberInput label="Trade-in value" value={tradeInValue} onChange={setTradeInValue} onBlur={validateInputs} />
          <NumberInput label="Cash rebate" value={rebate} onChange={setRebate} onBlur={validateInputs} />
          <NumberInput label="Sales tax %" value={salesTaxRate} onChange={setSalesTaxRate} onBlur={validateInputs} />
          <NumberInput label="Registration / dealer fees" value={fees} onChange={setFees} onBlur={validateInputs} />
          <NumberInput label="Interest rate %" value={interestRate} onChange={setInterestRate} onBlur={validateInputs} />
          <NumberInput label="Loan term months" value={loanTermMonths} onChange={setLoanTermMonths} onBlur={validateInputs} />
          <NumberInput label="Extra monthly payment" value={extraMonthlyPayment} onChange={setExtraMonthlyPayment} onBlur={validateInputs} />
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
        <ToolResultBox title="Auto loan estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Monthly payment" value={formatCurrency(result.monthlyPayment)} highlight />
            <ResultCard label="Loan amount" value={formatCurrency(result.loanAmount)} />
            <ResultCard label="Sales tax" value={formatCurrency(result.salesTax)} />
            <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
            <ResultCard label="Total paid to lender" value={formatCurrency(result.totalPaid)} />
            <ResultCard label="Total out of pocket" value={formatCurrency(result.totalOutOfPocket)} />
            <ResultCard label="Payoff time" value={`${result.payoffMonths} months`} />
            <ResultCard label="Down payment ratio" value={formatPercent(result.effectiveDownPaymentRate)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated monthly payment:{" "}
            <strong className="text-black">
              {formatCurrency(result.monthlyPayment)}
            </strong>
            . Estimated financed amount:{" "}
            <strong className="text-black">
              {formatCurrency(result.loanAmount)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid car purchase and financing details to calculate your auto
          loan estimate.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator is an estimate. Actual payments can vary based on lender
        terms, credit score, taxes, fees, insurance, warranty products and local
        rules.
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