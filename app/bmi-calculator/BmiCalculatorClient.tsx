"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type UnitSystem = "metric" | "imperial";

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLb, setWeightLb] = useState(160);
  const [age, setAge] = useState(30);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const heightMeters =
      unitSystem === "metric"
        ? heightCm / 100
        : ((heightFt * 12 + heightIn) * 2.54) / 100;

    const weight =
      unitSystem === "metric" ? weightKg : weightLb * 0.45359237;

    if (heightMeters <= 0 || weight <= 0 || age < 0) {
      return null;
    }

    const bmi = weight / (heightMeters * heightMeters);
    const minHealthyWeight = 18.5 * heightMeters * heightMeters;
    const maxHealthyWeight = 24.9 * heightMeters * heightMeters;

    return {
      bmi,
      category: getBmiCategory(bmi),
      minHealthyWeightKg: minHealthyWeight,
      maxHealthyWeightKg: maxHealthyWeight,
      minHealthyWeightLb: minHealthyWeight * 2.20462262,
      maxHealthyWeightLb: maxHealthyWeight * 2.20462262,
    };
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLb, age]);

  function validateInputs() {
    if (age < 0) {
      setError("Age cannot be negative.");
      return false;
    }

    if (
      (unitSystem === "metric" && (heightCm <= 0 || weightKg <= 0)) ||
      (unitSystem === "imperial" && (heightFt < 0 || heightIn < 0 || heightFt * 12 + heightIn <= 0 || weightLb <= 0))
    ) {
      setError("Height and weight must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setUnitSystem("metric");
    setHeightCm(175);
    setWeightKg(72);
    setHeightFt(5);
    setHeightIn(9);
    setWeightLb(160);
    setAge(30);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate BMI
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate body mass index using metric or imperial units and view a
          general weight category.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Units</span>

          <select
            value={unitSystem}
            onChange={(event) => {
              setUnitSystem(event.target.value as UnitSystem);
              setError("");
            }}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="metric">Metric — cm / kg</option>
            <option value="imperial">Imperial — ft / in / lb</option>
          </select>
        </label>

        {unitSystem === "metric" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Height cm" value={heightCm} onChange={setHeightCm} onBlur={validateInputs} />
            <NumberInput label="Weight kg" value={weightKg} onChange={setWeightKg} onBlur={validateInputs} />
            <NumberInput label="Age optional" value={age} onChange={setAge} onBlur={validateInputs} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Height feet" value={heightFt} onChange={setHeightFt} onBlur={validateInputs} />
            <NumberInput label="Height inches" value={heightIn} onChange={setHeightIn} onBlur={validateInputs} />
            <NumberInput label="Weight lb" value={weightLb} onChange={setWeightLb} onBlur={validateInputs} />
            <NumberInput label="Age optional" value={age} onChange={setAge} onBlur={validateInputs} />
          </div>
        )}

        {error && <ToolErrorBox message={error} />}

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit">
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="BMI result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="BMI" value={result.bmi.toFixed(1)} highlight />
            <ResultCard label="Category" value={result.category} />
            <ResultCard label="Healthy weight range kg" value={`${result.minHealthyWeightKg.toFixed(1)}–${result.maxHealthyWeightKg.toFixed(1)} kg`} />
            <ResultCard label="Healthy weight range lb" value={`${result.minHealthyWeightLb.toFixed(1)}–${result.maxHealthyWeightLb.toFixed(1)} lb`} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid height and weight to calculate BMI.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        BMI is a general screening estimate only. It does not account for muscle
        mass, body composition, pregnancy, age-specific guidance or medical
        conditions.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({ label, value, onChange, onBlur }: { label: string; value: number; onChange: (value: number) => void; onBlur: () => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-black bg-black text-white" : "border-black/10 bg-white text-black"}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${highlight ? "text-white/50" : "text-black/40"}`}>{label}</div>
      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}