"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function diffCalendarDates(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export default function AgeCalculatorClient() {
  const today = new Date();

  const [birthDate, setBirthDate] = useState("1995-06-15");
  const [targetDate, setTargetDate] = useState(toDateInputValue(today));
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const birth = new Date(`${birthDate}T00:00:00`);
    const target = new Date(`${targetDate}T00:00:00`);

    if (
      Number.isNaN(birth.getTime()) ||
      Number.isNaN(target.getTime()) ||
      birth > target
    ) {
      return null;
    }

    const age = diffCalendarDates(birth, target);
    const totalMilliseconds = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = age.years * 12 + age.months;

    const nextBirthday = new Date(
      target.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );

    if (nextBirthday < target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      ...age,
      totalDays,
      totalWeeks,
      totalMonths,
      daysUntilBirthday,
      nextBirthday: toDateInputValue(nextBirthday),
    };
  }, [birthDate, targetDate]);

  function validateInputs() {
    const birth = new Date(`${birthDate}T00:00:00`);
    const target = new Date(`${targetDate}T00:00:00`);

    if (Number.isNaN(birth.getTime()) || Number.isNaN(target.getTime())) {
      setError("Please enter valid dates.");
      return false;
    }

    if (birth > target) {
      setError("Birth date must be before the target date.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setBirthDate("1995-06-15");
    setTargetDate(toDateInputValue(new Date()));
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate age
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate exact age in years, months and days, plus total days, weeks,
          months and next birthday countdown.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Birth date</span>
            <input
              type="date"
              value={birthDate}
              onChange={(event) => {
                setBirthDate(event.target.value);
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">Calculate age on</span>
            <input
              type="date"
              value={targetDate}
              onChange={(event) => {
                setTargetDate(event.target.value);
                setError("");
              }}
              onBlur={validateInputs}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            />
          </label>
        </div>

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Age result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Exact age" value={`${result.years} years, ${result.months} months, ${result.days} days`} highlight />
            <ResultCard label="Total days" value={result.totalDays.toLocaleString()} />
            <ResultCard label="Total weeks" value={result.totalWeeks.toLocaleString()} />
            <ResultCard label="Total months" value={result.totalMonths.toLocaleString()} />
            <ResultCard label="Days until next birthday" value={String(result.daysUntilBirthday)} />
            <ResultCard label="Next birthday" value={result.nextBirthday} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter a valid birth date and target date to calculate age.
        </ToolInfoBox>
      )}
    </div>
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