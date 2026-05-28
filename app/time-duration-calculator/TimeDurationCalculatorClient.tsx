"use client";

import { useMemo, useState } from "react";

export default function TimeDurationCalculatorClient() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const result = useMemo(() => {
    if (!startTime || !endTime) {
      return {
        hours: "",
        minutes: "",
        totalMinutes: "",
      };
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let startTotal = startHour * 60 + startMinute;
    let endTotal = endHour * 60 + endMinute;

    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const difference = endTotal - startTotal;

    return {
      hours: Math.floor(difference / 60).toString(),
      minutes: (difference % 60).toString(),
      totalMinutes: difference.toString(),
    };
  }, [startTime, endTime]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Time Duration
        </h2>

        <p className="text-black/60 leading-7">
          Calculate the time difference between two times in hours and minutes.
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="block mb-2 font-medium">
            Start Time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            End Time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Hours
          </div>

          <div className="text-3xl font-bold">
            {result.hours || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Minutes
          </div>

          <div className="text-3xl font-bold">
            {result.minutes || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Total Minutes
          </div>

          <div className="text-3xl font-bold">
            {result.totalMinutes || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}