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

export default function SalaryCalculatorClient() {
  const [annualSalary, setAnnualSalary] = useState(72000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [workWeeksPerYear, setWorkWeeksPerYear] = useState(52);
  const [paidVacationDays, setPaidVacationDays] = useState(15);
  const [paidHolidays, setPaidHolidays] = useState(10);
  const [bonus, setBonus] = useState(3000);
  const [taxRate, setTaxRate] = useState(24);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      annualSalary < 0 ||
      hoursPerWeek <= 0 ||
      workWeeksPerYear <= 0 ||
      paidVacationDays < 0 ||
      paidHolidays < 0 ||
      bonus < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const grossAnnual = annualSalary + bonus;
    const estimatedTax = grossAnnual * (taxRate / 100);
    const netAnnual = grossAnnual - estimatedTax;

    const paidDaysOff = paidVacationDays + paidHolidays;
    const paidWeeksOff = paidDaysOff / 5;
    const effectiveWorkWeeks = Math.max(1, workWeeksPerYear - paidWeeksOff);

    const annualHours = hoursPerWeek * workWeeksPerYear;
    const effectiveWorkHours = hoursPerWeek * effectiveWorkWeeks;

    const grossMonthly = grossAnnual / 12;
    const grossBiweekly = grossAnnual / 26;
    const grossWeekly = grossAnnual / 52;
    const grossDaily = grossAnnual / (workWeeksPerYear * 5);
    const grossHourly = grossAnnual / annualHours;

    const effectiveHourly = grossAnnual / effectiveWorkHours;
    const netMonthly = netAnnual / 12;
    const netBiweekly = netAnnual / 26;
    const netWeekly = netAnnual / 52;
    const netHourly = netAnnual / annualHours;

    return {
      grossAnnual,
      netAnnual,
      estimatedTax,
      grossMonthly,
      grossBiweekly,
      grossWeekly,
      grossDaily,
      grossHourly,
      effectiveHourly,
      netMonthly,
      netBiweekly,
      netWeekly,
      netHourly,
      annualHours,
      effectiveWorkHours,
    };
  }, [
    annualSalary,
    hoursPerWeek,
    workWeeksPerYear,
    paidVacationDays,
    paidHolidays,
    bonus,
    taxRate,
  ]);

  function validateInputs() {
    if (annualSalary < 0 || bonus < 0) {
      setError("Salary and bonus cannot be negative.");
      return false;
    }

    if (hoursPerWeek <= 0 || workWeeksPerYear <= 0) {
      setError("Working hours and work weeks must be greater than zero.");
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
    setAnnualSalary(72000);
    setHoursPerWeek(40);
    setWorkWeeksPerYear(52);
    setPaidVacationDays(15);
    setPaidHolidays(10);
    setBonus(3000);
    setTaxRate(24);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate salary breakdown
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert annual salary into monthly, biweekly, weekly, daily and hourly
          pay with bonus, paid time off and estimated taxes.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Annual salary" value={annualSalary} onChange={setAnnualSalary} onBlur={validateInputs} />
          <NumberInput label="Annual bonus" value={bonus} onChange={setBonus} onBlur={validateInputs} />
          <NumberInput label="Hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} onBlur={validateInputs} />
          <NumberInput label="Work weeks per year" value={workWeeksPerYear} onChange={setWorkWeeksPerYear} onBlur={validateInputs} />
          <NumberInput label="Paid vacation days" value={paidVacationDays} onChange={setPaidVacationDays} onBlur={validateInputs} />
          <NumberInput label="Paid holidays" value={paidHolidays} onChange={setPaidHolidays} onBlur={validateInputs} />
          <NumberInput label="Estimated tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
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
        <ToolResultBox title="Salary breakdown">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Gross annual" value={formatCurrency(result.grossAnnual)} highlight />
            <ResultCard label="Estimated net annual" value={formatCurrency(result.netAnnual)} />
            <ResultCard label="Gross monthly" value={formatCurrency(result.grossMonthly)} />
            <ResultCard label="Net monthly" value={formatCurrency(result.netMonthly)} />
            <ResultCard label="Gross biweekly" value={formatCurrency(result.grossBiweekly)} />
            <ResultCard label="Net biweekly" value={formatCurrency(result.netBiweekly)} />
            <ResultCard label="Gross weekly" value={formatCurrency(result.grossWeekly)} />
            <ResultCard label="Net weekly" value={formatCurrency(result.netWeekly)} />
            <ResultCard label="Gross hourly" value={formatCurrency(result.grossHourly)} />
            <ResultCard label="Effective hourly" value={formatCurrency(result.effectiveHourly)} />
            <ResultCard label="Estimated taxes" value={formatCurrency(result.estimatedTax)} />
            <ResultCard label="Annual work hours" value={`${Math.round(result.annualHours)} hours`} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your estimated gross monthly pay is{" "}
            <strong className="text-black">
              {formatCurrency(result.grossMonthly)}
            </strong>
            . After estimated taxes, monthly pay is about{" "}
            <strong className="text-black">
              {formatCurrency(result.netMonthly)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid salary details to calculate a full pay breakdown.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This salary calculator provides estimates only. Actual take-home pay can
        vary by country, state, benefits, deductions, payroll rules and tax
        situation.
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