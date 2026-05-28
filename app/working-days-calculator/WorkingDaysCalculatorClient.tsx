"use client";

import { useMemo, useState } from "react";

export default function WorkingDaysCalculatorClient() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const result = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        workingDays: "",
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let count = 0;

    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();

      if (day !== 0 && day !== 6) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      workingDays: count.toString(),
    };
  }, [startDate, endDate]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Working Days
        </h2>

        <p className="text-black/60 leading-7">
          Calculate the number of weekdays between two dates excluding weekends.
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

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Working Days
        </div>

        <div className="text-3xl font-bold">
          {result.workingDays || "0"}
        </div>
      </div>
    </div>
  );
}