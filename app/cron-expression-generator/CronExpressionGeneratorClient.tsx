"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Frequency =
  | "every-minute"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "custom";

const DAYS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

export default function CronExpressionGeneratorClient() {
  const [frequency, setFrequency] =
    useState<Frequency>("daily");

  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("0");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [dayOfMonth, setDayOfMonth] = useState("1");

  const result = useMemo(() => {
    let expression = "* * * * *";
    let explanation = "Runs every minute.";

    if (frequency === "hourly") {
      expression = `${minute} * * * *`;
      explanation = `Runs every hour at minute ${minute}.`;
    }

    if (frequency === "daily") {
      expression = `${minute} ${hour} * * *`;
      explanation = `Runs every day at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`;
    }

    if (frequency === "weekly") {
      expression = `${minute} ${hour} * * ${dayOfWeek}`;

      explanation = `Runs every ${
        DAYS.find((day) => day.value === dayOfWeek)?.label
      } at ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}.`;
    }

    if (frequency === "monthly") {
      expression = `${minute} ${hour} ${dayOfMonth} * *`;

      explanation = `Runs on day ${dayOfMonth} of every month at ${hour.padStart(
        2,
        "0"
      )}:${minute.padStart(2, "0")}.`;
    }

    return {
      expression,
      explanation,
    };
  }, [
    frequency,
    minute,
    hour,
    dayOfWeek,
    dayOfMonth,
  ]);

  async function copyResult() {
    await navigator.clipboard.writeText(result.expression);
  }

  function resetExample() {
    setFrequency("daily");
    setMinute("0");
    setHour("0");
    setDayOfWeek("1");
    setDayOfMonth("1");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate cron expressions
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Build cron schedules visually for servers, automations, scripts and
          scheduled jobs.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          Schedule frequency
        </span>

        <select
          value={frequency}
          onChange={(event) =>
            setFrequency(event.target.value as Frequency)
          }
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        >
          <option value="every-minute">Every minute</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>

      {frequency !== "every-minute" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Minute"
            value={minute}
            onChange={setMinute}
          />

          {(frequency === "daily" ||
            frequency === "weekly" ||
            frequency === "monthly") && (
            <Input
              label="Hour"
              value={hour}
              onChange={setHour}
            />
          )}

          {frequency === "weekly" && (
            <label className="block">
              <span className="text-sm font-bold text-black">
                Day of week
              </span>

              <select
                value={dayOfWeek}
                onChange={(event) =>
                  setDayOfWeek(event.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {frequency === "monthly" && (
            <Input
              label="Day of month"
              value={dayOfMonth}
              onChange={setDayOfMonth}
            />
          )}
        </div>
      )}

      <ToolResultBox title="Cron expression">
        <div className="rounded-[2rem] border border-black/10 bg-white px-5 py-5 font-mono text-lg text-black break-all">
          {result.expression}
        </div>

        <div className="mt-5 rounded-2xl bg-[#fff8df] px-5 py-4 text-sm text-black">
          {result.explanation}
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyResult}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Copy cron expression
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Standard cron expressions use five fields:
        minute, hour, day of month, month and day of week.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 font-mono text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}