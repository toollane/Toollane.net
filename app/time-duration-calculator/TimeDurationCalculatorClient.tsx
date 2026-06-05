"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatDuration(totalMinutes: number) {
  const days = Math.floor(totalMinutes / 1440);
  const remainingAfterDays = totalMinutes % 1440;
  const hours = Math.floor(remainingAfterDays / 60);
  const minutes = remainingAfterDays % 60;

  return { days, hours, minutes };
}

export default function TimeDurationCalculatorClient() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [crossesMidnight, setCrossesMidnight] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const start = parseTimeToMinutes(startTime);
    let end = parseTimeToMinutes(endTime);

    if (crossesMidnight || end < start) {
      end += 1440;
    }

    const grossMinutes = end - start;
    const netMinutes = grossMinutes - breakMinutes;

    if (grossMinutes < 0 || breakMinutes < 0 || netMinutes < 0 || hourlyRate < 0) {
      return null;
    }

    const gross = formatDuration(grossMinutes);
    const net = formatDuration(netMinutes);
    const decimalHours = netMinutes / 60;
    const earnings = decimalHours * hourlyRate;

    return {
      grossMinutes,
      netMinutes,
      gross,
      net,
      decimalHours,
      earnings,
    };
  }, [startTime, endTime, breakMinutes, crossesMidnight, hourlyRate]);

  function validateInputs() {
    if (breakMinutes < 0 || hourlyRate < 0) {
      setError("Break time and hourly rate cannot be negative.");
      return false;
    }

    const start = parseTimeToMinutes(startTime);
    let end = parseTimeToMinutes(endTime);

    if (crossesMidnight || end < start) {
      end += 1440;
    }

    if (end - start - breakMinutes < 0) {
      setError("Break time cannot be longer than the duration.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setStartTime("09:00");
    setEndTime("17:30");
    setBreakMinutes(30);
    setCrossesMidnight(false);
    setHourlyRate(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate time duration
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate the duration between two times, including breaks, overnight
          shifts and optional hourly earnings.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TimeInput label="Start time" value={startTime} onChange={setStartTime} onBlur={validateInputs} />
          <TimeInput label="End time" value={endTime} onChange={setEndTime} onBlur={validateInputs} />
          <NumberInput label="Break minutes" value={breakMinutes} onChange={setBreakMinutes} onBlur={validateInputs} />
          <NumberInput label="Hourly rate optional" value={hourlyRate} onChange={setHourlyRate} onBlur={validateInputs} />
        </div>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span>
            <span className="block text-sm font-bold text-black">
              Crosses midnight
            </span>
            <span className="mt-1 block text-xs leading-5 text-black/50">
              Enable this for overnight shifts.
            </span>
          </span>

          <input
            type="checkbox"
            checked={crossesMidnight}
            onChange={(event) => setCrossesMidnight(event.target.checked)}
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
        <ToolResultBox title="Time duration result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Net duration" value={`${result.net.days}d ${result.net.hours}h ${result.net.minutes}m`} highlight />
            <ResultCard label="Gross duration" value={`${result.gross.days}d ${result.gross.hours}h ${result.gross.minutes}m`} />
            <ResultCard label="Net minutes" value={result.netMinutes.toLocaleString()} />
            <ResultCard label="Gross minutes" value={result.grossMinutes.toLocaleString()} />
            <ResultCard label="Decimal hours" value={result.decimalHours.toFixed(2)} />
            <ResultCard label="Estimated earnings" value={result.earnings.toFixed(2)} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid times and break duration to calculate time.
        </ToolInfoBox>
      )}
    </div>
  );
}

function TimeInput({
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
        type="time"
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