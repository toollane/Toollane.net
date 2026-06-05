"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function calendarDifference(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export default function DateDifferenceCalculatorClient() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(toDateInputValue(new Date()));
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const endBase = new Date(`${endDate}T00:00:00`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(endBase.getTime()) ||
      start > endBase
    ) {
      return null;
    }

    const end = new Date(endBase);

    if (includeEndDate) {
      end.setDate(end.getDate() + 1);
    }

    const totalDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const diffEnd = new Date(end);

    if (includeEndDate) {
      diffEnd.setDate(diffEnd.getDate() - 1);
    }

    const calendar = calendarDifference(start, diffEnd);
    const totalWeeks = totalDays / 7;
    const totalMonthsApprox = totalDays / 30.436875;
    const totalYearsApprox = totalDays / 365.2425;

    return {
      ...calendar,
      totalDays,
      totalWeeks,
      totalMonthsApprox,
      totalYearsApprox,
      hours: totalDays * 24,
      minutes: totalDays * 24 * 60,
    };
  }, [startDate, endDate, includeEndDate]);

  function validateInputs() {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Please enter valid dates.");
      return false;
    }

    if (start > end) {
      setError("Start date must be before or equal to end date.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setStartDate("2026-01-01");
    setEndDate(toDateInputValue(new Date()));
    setIncludeEndDate(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate date difference
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Find the difference between two dates in days, weeks, months, years,
          hours and minutes.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput label="Start date" value={startDate} onChange={setStartDate} onBlur={validateInputs} />
          <DateInput label="End date" value={endDate} onChange={setEndDate} onBlur={validateInputs} />
        </div>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span>
            <span className="block text-sm font-bold text-black">
              Include end date
            </span>
            <span className="mt-1 block text-xs leading-5 text-black/50">
              Count the final date as a full extra day.
            </span>
          </span>

          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(event) => setIncludeEndDate(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>

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
        <ToolResultBox title="Date difference result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Calendar difference" value={`${result.years} years, ${result.months} months, ${result.days} days`} highlight />
            <ResultCard label="Total days" value={result.totalDays.toLocaleString()} />
            <ResultCard label="Total weeks" value={result.totalWeeks.toFixed(2)} />
            <ResultCard label="Approx. months" value={result.totalMonthsApprox.toFixed(2)} />
            <ResultCard label="Approx. years" value={result.totalYearsApprox.toFixed(2)} />
            <ResultCard label="Hours" value={result.hours.toLocaleString()} />
            <ResultCard label="Minutes" value={result.minutes.toLocaleString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid dates to calculate the difference.
        </ToolInfoBox>
      )}
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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