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

export default function CommissionCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [salesAmount, setSalesAmount] = useState(50000);
  const [commissionRate, setCommissionRate] = useState(8);
  const [baseSalary, setBaseSalary] = useState(3000);
  const [bonusThreshold, setBonusThreshold] = useState(40000);
  const [bonusAmount, setBonusAmount] = useState(1000);
  const [deductions, setDeductions] = useState(250);
  const [taxRate, setTaxRate] = useState(20);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      salesAmount < 0 ||
      commissionRate < 0 ||
      baseSalary < 0 ||
      bonusThreshold < 0 ||
      bonusAmount < 0 ||
      deductions < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const commission = salesAmount * (commissionRate / 100);
    const bonus = salesAmount >= bonusThreshold ? bonusAmount : 0;
    const grossPay = baseSalary + commission + bonus;
    const taxablePay = Math.max(0, grossPay - deductions);
    const estimatedTax = taxablePay * (taxRate / 100);
    const netPay = grossPay - deductions - estimatedTax;

    return {
      commission,
      bonus,
      grossPay,
      taxablePay,
      estimatedTax,
      netPay,
      effectiveCommissionRate: salesAmount > 0 ? (commission / salesAmount) * 100 : 0,
    };
  }, [
    salesAmount,
    commissionRate,
    baseSalary,
    bonusThreshold,
    bonusAmount,
    deductions,
    taxRate,
  ]);

  function validateInputs() {
    if (
      salesAmount < 0 ||
      commissionRate < 0 ||
      baseSalary < 0 ||
      bonusThreshold < 0 ||
      bonusAmount < 0 ||
      deductions < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (taxRate < 0 || taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setSalesAmount(50000);
    setCommissionRate(8);
    setBaseSalary(3000);
    setBonusThreshold(40000);
    setBonusAmount(1000);
    setDeductions(250);
    setTaxRate(20);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate commission
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate commission pay with sales volume, commission rate, base pay,
          bonus threshold, deductions and estimated taxes.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="CHF">CHF</option><option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Sales amount" value={salesAmount} onChange={setSalesAmount} onBlur={validateInputs} />
          <NumberInput label="Commission rate %" value={commissionRate} onChange={setCommissionRate} onBlur={validateInputs} />
          <NumberInput label="Base salary / pay" value={baseSalary} onChange={setBaseSalary} onBlur={validateInputs} />
          <NumberInput label="Bonus threshold" value={bonusThreshold} onChange={setBonusThreshold} onBlur={validateInputs} />
          <NumberInput label="Bonus amount" value={bonusAmount} onChange={setBonusAmount} onBlur={validateInputs} />
          <NumberInput label="Deductions" value={deductions} onChange={setDeductions} onBlur={validateInputs} />
          <NumberInput label="Estimated tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Commission result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Net pay" value={formatCurrency(result.netPay, currency)} highlight />
            <ResultCard label="Commission" value={formatCurrency(result.commission, currency)} />
            <ResultCard label="Bonus" value={formatCurrency(result.bonus, currency)} />
            <ResultCard label="Gross pay" value={formatCurrency(result.grossPay, currency)} />
            <ResultCard label="Taxable pay" value={formatCurrency(result.taxablePay, currency)} />
            <ResultCard label="Estimated tax" value={formatCurrency(result.estimatedTax, currency)} />
            <ResultCard label="Effective commission rate" value={`${result.effectiveCommissionRate.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid commission values to calculate pay.
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