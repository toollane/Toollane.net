"use client";

import { useMemo, useState } from "react";

export default function CronExpressionGeneratorClient() {
  const [minute, setMinute] =
    useState("*");

  const [hour, setHour] =
    useState("*");

  const [day, setDay] =
    useState("*");

  const cron = useMemo(() => {
    return `${minute} ${hour} ${day} * *`;
  }, [minute, hour, day]);

  const copyCron = async () => {
    await navigator.clipboard.writeText(
      cron
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Cron Expression Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate cron expressions
          instantly for scheduled
          tasks and automation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          value={minute}
          onChange={(event) =>
            setMinute(
              event.target.value
            )
          }
          placeholder="Minute"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={hour}
          onChange={(event) =>
            setHour(
              event.target.value
            )
          }
          placeholder="Hour"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={day}
          onChange={(event) =>
            setDay(
              event.target.value
            )
          }
          placeholder="Day"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Cron Expression
        </div>

        <div className="font-mono text-2xl font-bold break-all">
          {cron}
        </div>
      </div>

      <button
        onClick={copyCron}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Copy Cron Expression
      </button>
    </div>
  );
}