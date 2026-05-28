"use client";

import { useMemo, useState } from "react";

export default function DateDifferenceCalculatorClient() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const result = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        days: "",
        weeks: "",
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference =
      Math.abs(end.getTime() - start.getTime());

    const days = difference / (1000 * 60 * 60 * 24);
    const weeks = days / 7;

    return {
      days: days.toFixed(0),
      weeks: weeks.toFixed(1),
    };
  }, [startDate, endDate]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Date Difference
        </h2>

        <p className="text-black/60 leading-7">
          Calculate the number of days and weeks between two dates.
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <label className="block mb-2 font-medium">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Difference in Days
          </div>

          <div className="text-3xl font-bold">
            {result.days || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Difference in Weeks
          </div>

          <div className="text-3xl font-bold">
            {result.weeks || "0"}
          </div>
        </div>
      </div>
    </div>
  );
}