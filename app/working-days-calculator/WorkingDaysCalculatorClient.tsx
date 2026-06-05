"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseHolidayList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => new Date(`${item}T00:00:00`).toDateString());
}

export default function WorkingDaysCalculatorClient() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(toDateInputValue(new Date()));
  const [includeEndDate, setIncludeEndDate] = useState(true);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [holidays, setHolidays] = useState("2026-01-01, 2026-12-25");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end ||
      hoursPerDay < 0
    ) {
      return null;
    }

    const holidaySet = new Set(parseHolidayList(holidays));
    const current = new Date(start);
    let totalDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    let workingDays = 0;

    const finalDate = new Date(end);

    if (includeEndDate) {
      finalDate.setDate(finalDate.getDate() + 1);
    }

    while (current < finalDate) {
      totalDays += 1;

      const day = current.getDay();
      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidaySet.has(current.toDateString());

      if (isWeekend) weekendDays += 1;
      if (isHoliday && (!excludeWeekends || !isWeekend)) holidayDays += 1;

      if ((!excludeWeekends || !isWeekend) && !isHoliday) {
        workingDays += 1;
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      totalDays,
      weekendDays,
      holidayDays,
      workingDays,
      nonWorkingDays: totalDays - workingDays,
      workingHours: workingDays * hoursPerDay,
    };
  }, [
    startDate,
    endDate,
    includeEndDate,
    excludeWeekends,
    holidays,
    hoursPerDay,
  ]);

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

    if (hoursPerDay < 0) {
      setError("Hours per working day cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setStartDate("2026-01-01");
    setEndDate(toDateInputValue(new Date()));
    setIncludeEndDate(true);
    setExcludeWeekends(true);
    setHolidays("2026-01-01, 2026-12-25");
    setHoursPerDay(8);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate working days
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Count working days between two dates, excluding weekends and custom
          holidays.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput label="Start date" value={startDate} onChange={setStartDate} onBlur={validateInputs} />
          <DateInput label="End date" value={endDate} onChange={setEndDate} onBlur={validateInputs} />
          <NumberInput label="Hours per working day" value={hoursPerDay} onChange={setHoursPerDay} onBlur={validateInputs} />
        </div>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Holidays optional
          </span>

          <textarea
            value={holidays}
            onChange={(event) => setHolidays(event.target.value)}
            onBlur={validateInputs}
            className="mt-3 min-h-[120px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="2026-01-01, 2026-12-25"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Include end date" checked={includeEndDate} onChange={setIncludeEndDate} />
          <Toggle label="Exclude weekends" checked={excludeWeekends} onChange={setExcludeWeekends} />
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
        <ToolResultBox title="Working days result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Working days" value={result.workingDays.toLocaleString()} highlight />
            <ResultCard label="Working hours" value={result.workingHours.toLocaleString()} />
            <ResultCard label="Total calendar days" value={result.totalDays.toLocaleString()} />
            <ResultCard label="Weekend days" value={result.weekendDays.toLocaleString()} />
            <ResultCard label="Holiday days" value={result.holidayDays.toLocaleString()} />
            <ResultCard label="Non-working days" value={result.nonWorkingDays.toLocaleString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid dates to calculate working days.
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
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