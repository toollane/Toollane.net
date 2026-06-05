"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type Assignment = {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
};

function getLetterGrade(percent: number) {
  if (percent >= 90) return "A";
  if (percent >= 80) return "B";
  if (percent >= 70) return "C";
  if (percent >= 60) return "D";
  return "F";
}

export default function GradeCalculatorClient() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: crypto.randomUUID(), name: "Homework", score: 88, maxScore: 100, weight: 30 },
    { id: crypto.randomUUID(), name: "Midterm", score: 82, maxScore: 100, weight: 30 },
    { id: crypto.randomUUID(), name: "Final Exam", score: 90, maxScore: 100, weight: 40 },
  ]);
  const [targetGrade, setTargetGrade] = useState(85);
  const [remainingWeight, setRemainingWeight] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      assignments.some(
        (item) =>
          !item.name.trim() ||
          item.score < 0 ||
          item.maxScore <= 0 ||
          item.weight < 0
      ) ||
      targetGrade < 0 ||
      targetGrade > 100 ||
      remainingWeight < 0 ||
      remainingWeight > 100
    ) {
      return null;
    }

    const usedWeight = assignments.reduce((sum, item) => sum + item.weight, 0);
    const weightedScore = assignments.reduce(
      (sum, item) => sum + (item.score / item.maxScore) * item.weight,
      0
    );

    const currentGrade = usedWeight > 0 ? (weightedScore / usedWeight) * 100 : 0;
    const courseGrade = weightedScore;

    const requiredOnRemaining =
      remainingWeight > 0
        ? ((targetGrade - courseGrade) / remainingWeight) * 100
        : null;

    return {
      usedWeight,
      weightedScore,
      currentGrade,
      courseGrade,
      letterGrade: getLetterGrade(usedWeight >= 100 ? courseGrade : currentGrade),
      requiredOnRemaining,
    };
  }, [assignments, targetGrade, remainingWeight]);

  function updateAssignment(id: string, key: keyof Assignment, value: string | number) {
    setAssignments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
    setError("");
  }

  function addAssignment() {
    setAssignments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "New assignment",
        score: 85,
        maxScore: 100,
        weight: 10,
      },
    ]);
  }

  function removeAssignment(id: string) {
    setAssignments((current) => current.filter((item) => item.id !== id));
  }

  function validateInputs() {
    if (assignments.some((item) => !item.name.trim())) {
      setError("Each assignment needs a name.");
      return false;
    }

    if (
      assignments.some(
        (item) => item.score < 0 || item.maxScore <= 0 || item.weight < 0
      )
    ) {
      setError("Scores and weights must be valid positive values.");
      return false;
    }

    if (targetGrade < 0 || targetGrade > 100 || remainingWeight < 0 || remainingWeight > 100) {
      setError("Target grade and remaining weight must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setAssignments([
      { id: crypto.randomUUID(), name: "Homework", score: 88, maxScore: 100, weight: 30 },
      { id: crypto.randomUUID(), name: "Midterm", score: 82, maxScore: 100, weight: 30 },
      { id: crypto.randomUUID(), name: "Final Exam", score: 90, maxScore: 100, weight: 40 },
    ]);
    setTargetGrade(85);
    setRemainingWeight(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate grades
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate weighted course grades and estimate what score you need on
          remaining work.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="font-bold text-black">Assignment #{index + 1}</div>

                {assignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAssignment(assignment.id)}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-black/5"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <label className="block">
                  <span className="text-sm font-bold text-black">Name</span>
                  <input
                    value={assignment.name}
                    onChange={(event) => updateAssignment(assignment.id, "name", event.target.value)}
                    onBlur={validateInputs}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                  />
                </label>

                <NumberInput label="Score" value={assignment.score} onChange={(value) => updateAssignment(assignment.id, "score", value)} onBlur={validateInputs} />
                <NumberInput label="Max score" value={assignment.maxScore} onChange={(value) => updateAssignment(assignment.id, "maxScore", value)} onBlur={validateInputs} />
                <NumberInput label="Weight %" value={assignment.weight} onChange={(value) => updateAssignment(assignment.id, "weight", value)} onBlur={validateInputs} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Target final grade %" value={targetGrade} onChange={setTargetGrade} onBlur={validateInputs} />
          <NumberInput label="Remaining weight %" value={remainingWeight} onChange={setRemainingWeight} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={addAssignment} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
            Add assignment
          </button>

          <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
            Reset example
          </button>
        </div>
      </div>

      {result ? (
        <ToolResultBox title="Grade result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Current grade" value={`${result.currentGrade.toFixed(2)}%`} highlight />
            <ResultCard label="Weighted score" value={`${result.weightedScore.toFixed(2)} / 100`} />
            <ResultCard label="Used weight" value={`${result.usedWeight.toFixed(2)}%`} />
            <ResultCard label="Letter grade" value={result.letterGrade} />
            <ResultCard label="Required on remaining work" value={result.requiredOnRemaining === null ? "No remaining weight" : `${result.requiredOnRemaining.toFixed(2)}%`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid assignment scores and weights to calculate grades.
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