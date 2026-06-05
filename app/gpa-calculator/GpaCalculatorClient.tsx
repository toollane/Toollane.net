"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Course = {
  id: string;
  name: string;
  credits: number;
  gradePoints: number;
};

function getLetterGrade(points: number) {
  if (points >= 3.7) return "A range";
  if (points >= 2.7) return "B range";
  if (points >= 1.7) return "C range";
  if (points >= 1) return "D range";
  return "F range";
}

export default function GpaCalculatorClient() {
  const [courses, setCourses] = useState<Course[]>([
    { id: crypto.randomUUID(), name: "Math", credits: 3, gradePoints: 3.7 },
    { id: crypto.randomUUID(), name: "English", credits: 4, gradePoints: 3.3 },
    { id: crypto.randomUUID(), name: "Science", credits: 3, gradePoints: 4 },
  ]);
  const [currentGpa, setCurrentGpa] = useState(3.2);
  const [completedCredits, setCompletedCredits] = useState(30);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      courses.some(
        (course) =>
          course.credits < 0 ||
          course.gradePoints < 0 ||
          course.gradePoints > 4 ||
          !course.name.trim()
      ) ||
      currentGpa < 0 ||
      currentGpa > 4 ||
      completedCredits < 0
    ) {
      return null;
    }

    const semesterCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const semesterQualityPoints = courses.reduce(
      (sum, course) => sum + course.credits * course.gradePoints,
      0
    );
    const semesterGpa =
      semesterCredits > 0 ? semesterQualityPoints / semesterCredits : 0;

    const cumulativeQualityPoints = currentGpa * completedCredits;
    const cumulativeCredits = completedCredits + semesterCredits;
    const cumulativeGpa =
      cumulativeCredits > 0
        ? (cumulativeQualityPoints + semesterQualityPoints) / cumulativeCredits
        : semesterGpa;

    return {
      semesterCredits,
      semesterQualityPoints,
      semesterGpa,
      cumulativeCredits,
      cumulativeGpa,
      letterRange: getLetterGrade(semesterGpa),
    };
  }, [courses, currentGpa, completedCredits]);

  function updateCourse(id: string, key: keyof Course, value: string | number) {
    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? {
              ...course,
              [key]: value,
            }
          : course
      )
    );
    setError("");
  }

  function addCourse() {
    setCourses((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "New Course",
        credits: 3,
        gradePoints: 3,
      },
    ]);
  }

  function removeCourse(id: string) {
    setCourses((current) => current.filter((course) => course.id !== id));
  }

  function validateInputs() {
    if (courses.some((course) => !course.name.trim())) {
      setError("Each course needs a name.");
      return false;
    }

    if (courses.some((course) => course.credits < 0)) {
      setError("Credits cannot be negative.");
      return false;
    }

    if (
      courses.some((course) => course.gradePoints < 0 || course.gradePoints > 4) ||
      currentGpa < 0 ||
      currentGpa > 4
    ) {
      setError("GPA and grade points must be between 0 and 4.");
      return false;
    }

    if (completedCredits < 0) {
      setError("Completed credits cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCourses([
      { id: crypto.randomUUID(), name: "Math", credits: 3, gradePoints: 3.7 },
      { id: crypto.randomUUID(), name: "English", credits: 4, gradePoints: 3.3 },
      { id: crypto.randomUUID(), name: "Science", credits: 3, gradePoints: 4 },
    ]);
    setCurrentGpa(3.2);
    setCompletedCredits(30);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate GPA
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate semester GPA and estimated cumulative GPA using course
          credits and grade points.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Current cumulative GPA" value={currentGpa} onChange={setCurrentGpa} onBlur={validateInputs} />
          <NumberInput label="Completed credits" value={completedCredits} onChange={setCompletedCredits} onBlur={validateInputs} />
        </div>

        <div className="grid gap-4">
          {courses.map((course, index) => (
            <div key={course.id} className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="font-bold text-black">Course #{index + 1}</div>

                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-black/5"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-bold text-black">Course name</span>
                  <input
                    value={course.name}
                    onChange={(event) => updateCourse(course.id, "name", event.target.value)}
                    onBlur={validateInputs}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                  />
                </label>

                <NumberInput label="Credits" value={course.credits} onChange={(value) => updateCourse(course.id, "credits", value)} onBlur={validateInputs} />
                <NumberInput label="Grade points" value={course.gradePoints} onChange={(value) => updateCourse(course.id, "gradePoints", value)} onBlur={validateInputs} />
              </div>
            </div>
          ))}
        </div>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={addCourse} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
            Add course
          </button>

          <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
            Reset example
          </button>
        </div>
      </div>

      {result ? (
        <ToolResultBox title="GPA result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Semester GPA" value={result.semesterGpa.toFixed(2)} highlight />
            <ResultCard label="Estimated cumulative GPA" value={result.cumulativeGpa.toFixed(2)} />
            <ResultCard label="Semester credits" value={String(result.semesterCredits)} />
            <ResultCard label="Cumulative credits" value={String(result.cumulativeCredits)} />
            <ResultCard label="Quality points" value={result.semesterQualityPoints.toFixed(2)} />
            <ResultCard label="Grade range" value={result.letterRange} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid courses, credits and grade points to calculate GPA.
        </ToolInfoBox>
      )}
    </div>
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
        step="0.1"
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