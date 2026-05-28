"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function GradeCalculatorClient() {
  const [earnedPoints, setEarnedPoints] = useState("");
  const [totalPoints, setTotalPoints] = useState("");

  const result = useMemo(() => {
    const earned = parseFloat(earnedPoints);
    const total = parseFloat(totalPoints);

    if (
      isNaN(earned) ||
      isNaN(total) ||
      earned < 0 ||
      total <= 0
    ) {
      return {
        percentage: "",
        letter: "",
      };
    }

    const percentage = (earned / total) * 100;

    let letter = "F";

    if (percentage >= 90) {
      letter = "A";
    } else if (percentage >= 80) {
      letter = "B";
    } else if (percentage >= 70) {
      letter = "C";
    } else if (percentage >= 60) {
      letter = "D";
    }

    return {
      percentage: percentage.toFixed(2),
      letter,
    };
  }, [earnedPoints, totalPoints]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Grade Percentage
        </h2>

        <p className="text-black/60 leading-7">
          Enter earned points and total points to calculate grade percentage and estimated letter grade.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Earned Points"
          value={earnedPoints}
          onChange={setEarnedPoints}
          placeholder="85"
        />

        <NumberInput
          label="Total Points"
          value={totalPoints}
          onChange={setTotalPoints}
          placeholder="100"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Grade Percentage
          </div>

          <div className="text-3xl font-bold">
            {result.percentage || "0"}%
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Estimated Letter Grade
          </div>

          <div className="text-3xl font-bold">
            {result.letter || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}