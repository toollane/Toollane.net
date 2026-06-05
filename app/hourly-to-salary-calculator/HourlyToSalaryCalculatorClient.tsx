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

export default function HourlyToSalaryCalculatorClient() {
  const [hourlyRate, setHourlyRate] = useState(35);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = useState(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [paidVacationDays, setPaidVacationDays] = useState(10);
  const [paidHolidays, setPaidHolidays] = useState(8);
  const [taxRate, setTaxRate] = useState(22);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      hourlyRate < 0 ||
      hoursPerWeek <= 0 ||
      weeksPerYear <= 0 ||
      overtimeHoursPerWeek < 0 ||
      overtimeMultiplier < 1 ||
      paidVacationDays < 0 ||
      paidHolidays < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const regularWeeklyPay = hourlyRate * hoursPerWeek;
    const overtimeWeeklyPay =
      hourlyRate * overtimeMultiplier * overtimeHoursPerWeek;

    const grossWeekly = regularWeeklyPay + overtimeWeeklyPay;
    const grossAnnual = grossWeekly * weeksPerYear;
    const estimatedTax = grossAnnual * (taxRate / 100);
    const netAnnual = grossAnnual - estimatedTax;

    const paidDaysOff = paidVacationDays + paidHolidays;
    const paidWeeksOff = paidDaysOff / 5;
    const effectiveWorkWeeks = Math.max(1, weeksPerYear - paidWeeksOff);

    const paidAnnualHours =
      (hoursPerWeek + overtimeHoursPerWeek) * weeksPerYear;

    const effectiveWorkedHours =
      (hoursPerWeek + overtimeHoursPerWeek) * effectiveWorkWeeks;

    const effectiveHourlyRate =
      effectiveWorkedHours > 0 ? grossAnnual / effectiveWorkedHours : 0;

    return {
      grossAnnual,
      netAnnual,
      estimatedTax,
      grossMonthly: grossAnnual / 12,
      netMonthly: netAnnual / 12,
      grossBiweekly: grossAnnual / 26,
      netBiweekly: netAnnual / 26,
      grossWeekly,
      netWeekly: netAnnual / 52,
      regularWeeklyPay,
      overtimeWeeklyPay,
      paidAnnualHours,
      effectiveWorkedHours,
      effectiveHourlyRate,
    };
  }, [
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    overtimeHoursPerWeek,
    overtimeMultiplier,
    paidVacationDays,
    paidHolidays,
    taxRate,
  ]);

  function validateInputs() {
    if (hourlyRate < 0) {
      setError("Hourly rate cannot be negative.");
      return false;
    }

    if (hoursPerWeek <= 0 || weeksPerYear <= 0) {
      setError("Hours per week and weeks per year must be greater than zero.");
      return false;
    }

    if (overtimeHoursPerWeek < 0 || overtimeMultiplier < 1) {
      setError("Overtime hours cannot be negative and multiplier must be at least 1.");
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
    setHourlyRate(35);
    setHoursPerWeek(40);
    setWeeksPerYear(52);
    setOvertimeHoursPerWeek(0);
    setOvertimeMultiplier(1.5);
    setPaidVacationDays(10);
    setPaidHolidays(8);
    setTaxRate(22);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert hourly wage to salary
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate annual salary from hourly pay with overtime, work schedule,
          paid time off and estimated taxes.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Hourly rate" value={hourlyRate} onChange={setHourlyRate} onBlur={validateInputs} />
          <NumberInput label="Regular hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} onBlur={validateInputs} />
          <NumberInput label="Work weeks per year" value={weeksPerYear} onChange={setWeeksPerYear} onBlur={validateInputs} />
          <NumberInput label="Overtime hours per week" value={overtimeHoursPerWeek} onChange={setOvertimeHoursPerWeek} onBlur={validateInputs} />
          <NumberInput label="Overtime multiplier" value={overtimeMultiplier} onChange={setOvertimeMultiplier} onBlur={validateInputs} />
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
        <ToolResultBox title="Hourly to salary result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Gross annual salary" value={formatCurrency(result.grossAnnual)} highlight />
            <ResultCard label="Estimated net annual" value={formatCurrency(result.netAnnual)} />
            <ResultCard label="Gross monthly" value={formatCurrency(result.grossMonthly)} />
            <ResultCard label="Net monthly" value={formatCurrency(result.netMonthly)} />
            <ResultCard label="Gross biweekly" value={formatCurrency(result.grossBiweekly)} />
            <ResultCard label="Net biweekly" value={formatCurrency(result.netBiweekly)} />
            <ResultCard label="Gross weekly" value={formatCurrency(result.grossWeekly)} />
            <ResultCard label="Net weekly" value={formatCurrency(result.netWeekly)} />
            <ResultCard label="Regular weekly pay" value={formatCurrency(result.regularWeeklyPay)} />
            <ResultCard label="Overtime weekly pay" value={formatCurrency(result.overtimeWeeklyPay)} />
            <ResultCard label="Paid annual hours" value={`${Math.round(result.paidAnnualHours)} hours`} />
            <ResultCard label="Effective hourly rate" value={formatCurrency(result.effectiveHourlyRate)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            At{" "}
            <strong className="text-black">{formatCurrency(hourlyRate)}</strong>{" "}
            per hour, your estimated gross annual salary is{" "}
            <strong className="text-black">
              {formatCurrency(result.grossAnnual)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid hourly pay and schedule details to calculate salary.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual pay may vary based on
        unpaid leave, taxes, benefits, deductions, overtime rules and employer
        policies.
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