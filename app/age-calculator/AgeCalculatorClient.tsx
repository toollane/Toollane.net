"use client";

import { useMemo, useState } from "react";

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] =
    useState("");

  const result = useMemo(() => {
    if (!birthDate) {
      return {
        years: "",
        months: "",
        days: "",
      };
    }

    const today = new Date();

    const birth = new Date(birthDate);

    if (isNaN(birth.getTime())) {
      return {
        years: "",
        months: "",
        days: "",
      };
    }

    let years =
      today.getFullYear() -
      birth.getFullYear();

    let months =
      today.getMonth() -
      birth.getMonth();

    let days =
      today.getDate() -
      birth.getDate();

    if (days < 0) {
      months--;

      const previousMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );

      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years,
      months,
      days,
    };
  }, [birthDate]);

  return (
    <div className="grid gap-8">

      {/* INTRO */}

      <div className="space-y-3">

        <h2 className="text-2xl font-bold">
          Calculate Your Exact Age
        </h2>

        <p className="text-black/60 leading-7">
          Instantly calculate your exact age in years, months and days using your date of birth.
        </p>

      </div>



      {/* INPUT */}

      <div>

        <label className="block mb-2 font-medium">
          Date of Birth
        </label>

        <input
          type="date"
          value={birthDate}
          onChange={(e) =>
            setBirthDate(e.target.value)
          }
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <div className="flex gap-6 mt-3 text-sm text-black/45">

          <span>
            MM = Month
          </span>

          <span>
            DD = Day
          </span>
        
          <span>
            YYYY = Year
          </span>

        </div>

      </div>



      {/* RESULTS */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Years
          </div>

          <div className="text-4xl font-bold">
            {result.years || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Months
          </div>

          <div className="text-4xl font-bold">
            {result.months || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Days
          </div>

          <div className="text-4xl font-bold">
            {result.days || "0"}
          </div>

        </div>

      </div>



      {/* EXTRA INFO */}

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">

        <h3 className="font-semibold mb-3">
          How the age calculation works
        </h3>

        <p className="text-black/60 leading-7">
          The calculator compares your birth date with today's date to determine your exact age. The result is displayed in full years, months and remaining days.
        </p>

      </div>

    </div>
  );
}   