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

export default function SalaryToHourlyCalculatorClient() {
  const [annualSalary, setAnnualSalary] = useState(72000);
  const [annualBonus, setAnnualBonus] = useState(3000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [workWeeksPerYear, setWorkWeeksPerYear] = useState(52);
  const [paidVacationDays, setPaidVacationDays] = useState(15);
  const [paidHolidays, setPaidHolidays] = useState(10);
  const [unpaidDaysOff, setUnpaidDaysOff] = useState(0);
  const [taxRate, setTaxRate] = useState(24);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      annualSalary < 0 ||
      annualBonus < 0 ||
      hoursPerWeek <= 0 ||
      workWeeksPerYear <= 0 ||
      paidVacationDays < 0 ||
      paidHolidays < 0 ||
      unpaidDaysOff < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const grossAnnual = annualSalary + annualBonus;
    const estimatedTax = grossAnnual * (taxRate / 100);
    const netAnnual = grossAnnual - estimatedTax;

    const paidDaysOff = paidVacationDays + paidHolidays;
    const paidWeeksOff = paidDaysOff / 5;
    const unpaidWeeksOff = unpaidDaysOff / 5;

    const paidHours = hoursPerWeek * workWeeksPerYear;
    const effectiveWorkedWeeks = Math.max(
      1,
      workWeeksPerYear - paidWeeksOff - unpaidWeeksOff
    );

    const effectiveWorkedHours = effectiveWorkedWeeks * hoursPerWeek;

    const grossHourly = grossAnnual / paidHours;
    const netHourly = netAnnual / paidHours;
    const effectiveGrossHourly = grossAnnual / effectiveWorkedHours;
    const effectiveNetHourly = netAnnual / effectiveWorkedHours;

    return {
      grossAnnual,
      netAnnual,
      estimatedTax,
      paidHours,
      effectiveWorkedHours,
      grossHourly,
      netHourly,
      effectiveGrossHourly,
      effectiveNetHourly,
      grossMonthly: grossAnnual / 12,
      netMonthly: netAnnual / 12,
      grossWeekly: grossAnnual / 52,
      netWeekly: netAnnual / 52,
    };
  }, [
    annualSalary,
    annualBonus,
    hoursPerWeek,
    workWeeksPerYear,
    paidVacationDays,
    paidHolidays,
    unpaidDaysOff,
    taxRate,
  ]);

  function validateInputs() {
    if (annualSalary < 0 || annualBonus < 0) {
      setError("Salary and bonus cannot be negative.");
      return false;
    }

    if (hoursPerWeek <= 0 || workWeeksPerYear <= 0) {
      setError("Hours per week and work weeks per year must be greater than zero.");
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
    setAnnualBonus(3000);
    setHoursPerWeek(40);
    setWorkWeeksPerYear(52);
    setPaidVacationDays(15);
    setPaidHolidays(10);
    setUnpaidDaysOff(0);
    setTaxRate(24);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert salary to hourly wage
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert annual salary into hourly pay with bonus, paid time off,
          unpaid leave and estimated tax assumptions.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Annual salary" value={annualSalary} onChange={setAnnualSalary} onBlur={validateInputs} />
          <NumberInput label="Annual bonus" value={annualBonus} onChange={setAnnualBonus} onBlur={validateInputs} />
          <NumberInput label="Hours per week" value={hoursPerWeek} onChange={setHoursPerWeek} onBlur={validateInputs} />
          <NumberInput label="Work weeks per year" value={workWeeksPerYear} onChange={setWorkWeeksPerYear} onBlur={validateInputs} />
          <NumberInput label="Paid vacation days" value={paidVacationDays} onChange={setPaidVacationDays} onBlur={validateInputs} />
          <NumberInput label="Paid holidays" value={paidHolidays} onChange={setPaidHolidays} onBlur={validateInputs} />
          <NumberInput label="Unpaid days off" value={unpaidDaysOff} onChange={setUnpaidDaysOff} onBlur={validateInputs} />
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
        <ToolResultBox title="Salary to hourly result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Gross hourly" value={formatCurrency(result.grossHourly)} highlight />
            <ResultCard label="Net hourly" value={formatCurrency(result.netHourly)} />
            <ResultCard label="Effective gross hourly" value={formatCurrency(result.effectiveGrossHourly)} />
            <ResultCard label="Effective net hourly" value={formatCurrency(result.effectiveNetHourly)} />
            <ResultCard label="Gross annual" value={formatCurrency(result.grossAnnual)} />
            <ResultCard label="Net annual" value={formatCurrency(result.netAnnual)} />
            <ResultCard label="Gross monthly" value={formatCurrency(result.grossMonthly)} />
            <ResultCard label="Net monthly" value={formatCurrency(result.netMonthly)} />
            <ResultCard label="Paid annual hours" value={`${Math.round(result.paidHours)} hours`} />
            <ResultCard label="Effective worked hours" value={`${Math.round(result.effectiveWorkedHours)} hours`} />
            <ResultCard label="Estimated taxes" value={formatCurrency(result.estimatedTax)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your estimated gross hourly wage is{" "}
            <strong className="text-black">
              {formatCurrency(result.grossHourly)}
            </strong>
            . Adjust paid time off and unpaid leave to compare effective hourly
            value.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid salary and working-time details to calculate hourly pay.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Effective hourly pay includes the value of paid time off by comparing
        salary against actual worked hours. Tax estimates are simplified.
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