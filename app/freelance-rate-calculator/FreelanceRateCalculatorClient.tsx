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

export default function FreelanceRateCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState(80000);
  const [businessExpenses, setBusinessExpenses] = useState(12000);
  const [taxRate, setTaxRate] = useState(25);
  const [profitBuffer, setProfitBuffer] = useState(10);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState(25);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState(46);
  const [nonBillableTimePercent, setNonBillableTimePercent] = useState(20);
  const [projectHours, setProjectHours] = useState(20);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      desiredAnnualIncome < 0 ||
      businessExpenses < 0 ||
      taxRate < 0 ||
      taxRate >= 100 ||
      profitBuffer < 0 ||
      billableHoursPerWeek <= 0 ||
      workingWeeksPerYear <= 0 ||
      nonBillableTimePercent < 0 ||
      nonBillableTimePercent > 100 ||
      projectHours < 0
    ) {
      return null;
    }

    const afterTaxNeed = desiredAnnualIncome + businessExpenses;
    const preTaxRevenueNeeded = afterTaxNeed / (1 - taxRate / 100);
    const revenueWithBuffer = preTaxRevenueNeeded * (1 + profitBuffer / 100);

    const grossBillableHours = billableHoursPerWeek * workingWeeksPerYear;
    const effectiveBillableHours =
      grossBillableHours * (1 - nonBillableTimePercent / 100);

    const hourlyRate =
      effectiveBillableHours > 0 ? revenueWithBuffer / effectiveBillableHours : 0;

    const dayRate = hourlyRate * 8;
    const weeklyRevenue = hourlyRate * billableHoursPerWeek;
    const projectRate = hourlyRate * projectHours;
    const monthlyRevenueTarget = revenueWithBuffer / 12;

    return {
      preTaxRevenueNeeded,
      revenueWithBuffer,
      grossBillableHours,
      effectiveBillableHours,
      hourlyRate,
      dayRate,
      weeklyRevenue,
      monthlyRevenueTarget,
      projectRate,
    };
  }, [
    desiredAnnualIncome,
    businessExpenses,
    taxRate,
    profitBuffer,
    billableHoursPerWeek,
    workingWeeksPerYear,
    nonBillableTimePercent,
    projectHours,
  ]);

  function validateInputs() {
    if (
      desiredAnnualIncome < 0 ||
      businessExpenses < 0 ||
      profitBuffer < 0 ||
      projectHours < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (taxRate < 0 || taxRate >= 100) {
      setError("Tax rate must be between 0 and below 100.");
      return false;
    }

    if (billableHoursPerWeek <= 0 || workingWeeksPerYear <= 0) {
      setError("Billable hours and working weeks must be greater than zero.");
      return false;
    }

    if (nonBillableTimePercent < 0 || nonBillableTimePercent > 100) {
      setError("Non-billable time must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setDesiredAnnualIncome(80000);
    setBusinessExpenses(12000);
    setTaxRate(25);
    setProfitBuffer(10);
    setBillableHoursPerWeek(25);
    setWorkingWeeksPerYear(46);
    setNonBillableTimePercent(20);
    setProjectHours(20);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate freelance rate
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate a sustainable freelance hourly rate using income goals,
          taxes, expenses, billable hours, non-billable time and project scope.
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
          <NumberInput label="Desired annual take-home income" value={desiredAnnualIncome} onChange={setDesiredAnnualIncome} onBlur={validateInputs} />
          <NumberInput label="Annual business expenses" value={businessExpenses} onChange={setBusinessExpenses} onBlur={validateInputs} />
          <NumberInput label="Estimated tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
          <NumberInput label="Profit / safety buffer %" value={profitBuffer} onChange={setProfitBuffer} onBlur={validateInputs} />
          <NumberInput label="Billable hours per week" value={billableHoursPerWeek} onChange={setBillableHoursPerWeek} onBlur={validateInputs} />
          <NumberInput label="Working weeks per year" value={workingWeeksPerYear} onChange={setWorkingWeeksPerYear} onBlur={validateInputs} />
          <NumberInput label="Non-billable time %" value={nonBillableTimePercent} onChange={setNonBillableTimePercent} onBlur={validateInputs} />
          <NumberInput label="Project hours" value={projectHours} onChange={setProjectHours} onBlur={validateInputs} />
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
        <ToolResultBox title="Freelance rate estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Recommended hourly rate" value={formatCurrency(result.hourlyRate, currency)} highlight />
            <ResultCard label="Day rate" value={formatCurrency(result.dayRate, currency)} />
            <ResultCard label="Project rate" value={formatCurrency(result.projectRate, currency)} />
            <ResultCard label="Monthly revenue target" value={formatCurrency(result.monthlyRevenueTarget, currency)} />
            <ResultCard label="Annual revenue target" value={formatCurrency(result.revenueWithBuffer, currency)} />
            <ResultCard label="Pre-tax revenue needed" value={formatCurrency(result.preTaxRevenueNeeded, currency)} />
            <ResultCard label="Gross billable hours" value={`${Math.round(result.grossBillableHours)} hours`} />
            <ResultCard label="Effective billable hours" value={`${Math.round(result.effectiveBillableHours)} hours`} />
            <ResultCard label="Weekly revenue target" value={formatCurrency(result.weeklyRevenue, currency)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid freelance business assumptions to calculate your rate.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Freelance rates should include taxes, admin time, sales time, unpaid
        vacation, business expenses, software, insurance and profit buffer.
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
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}