"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function GpaCalculatorClient() {
  const [gradePoints, setGradePoints] = useState("");
  const [credits, setCredits] = useState("");

  const result = useMemo(() => {
    const points = parseFloat(gradePoints);
    const creditHours = parseFloat(credits);

    if (
      isNaN(points) ||
      isNaN(creditHours) ||
      points < 0 ||
      creditHours <= 0
    ) {
      return {
        gpa: "",
      };
    }

    return {
      gpa: (points / creditHours).toFixed(2),
    };
  }, [gradePoints, credits]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate GPA
        </h2>

        <p className="text-black/60 leading-7">
          Calculate GPA by dividing total grade points by total credit hours.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Total Grade Points"
          value={gradePoints}
          onChange={setGradePoints}
          placeholder="45"
        />

        <NumberInput
          label="Total Credit Hours"
          value={credits}
          onChange={setCredits}
          placeholder="15"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          GPA
        </div>

        <div className="text-3xl font-bold">
          {result.gpa || "0"}
        </div>
      </div>
    </div>
  );
}