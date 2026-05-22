"use client";

import { useMemo, useState } from "react";

export default function BmiCalculatorClient() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("imperial");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");

  const result = useMemo(() => {
    if (unitSystem === "metric") {
      const height = parseFloat(heightCm);
      const weight = parseFloat(weightKg);

      if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        return {
          bmi: "",
          category: "",
        };
      }

      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);

      return {
        bmi: bmi.toFixed(1),
        category: getBmiCategory(bmi),
      };
    }

    const feet = parseFloat(heightFt);
    const inches = parseFloat(heightIn || "0");
    const pounds = parseFloat(weightLb);

    if (
      isNaN(feet) ||
      isNaN(inches) ||
      isNaN(pounds) ||
      feet < 0 ||
      inches < 0 ||
      pounds <= 0
    ) {
      return {
        bmi: "",
        category: "",
      };
    }

    const totalInches = feet * 12 + inches;

    if (totalInches <= 0) {
      return {
        bmi: "",
        category: "",
      };
    }

    const bmi = (pounds / (totalInches * totalInches)) * 703;

    return {
      bmi: bmi.toFixed(1),
      category: getBmiCategory(bmi),
    };
  }, [
    unitSystem,
    heightCm,
    weightKg,
    heightFt,
    heightIn,
    weightLb,
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setUnitSystem("imperial")}
          className={`px-4 py-3 rounded-2xl border transition ${
            unitSystem === "imperial"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          US units
        </button>

        <button
          type="button"
          onClick={() => setUnitSystem("metric")}
          className={`px-4 py-3 rounded-2xl border transition ${
            unitSystem === "metric"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Metric
        </button>
      </div>

      {unitSystem === "imperial" && (
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">
                Height feet
              </label>

              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Height inches
              </label>

              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="10"
                className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Weight in lbs
            </label>

            <input
              type="number"
              value={weightLb}
              onChange={(e) => setWeightLb(e.target.value)}
              placeholder="170"
              className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
            />
          </div>
        </div>
      )}

      {unitSystem === "metric" && (
        <div className="grid gap-6">
          <div>
            <label className="block mb-2 font-medium">
              Height in cm
            </label>

            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="180"
              className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Weight in kg
            </label>

            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="75"
              className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            BMI
          </div>

          <div className="text-3xl font-bold">
            {result.bmi || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Category
          </div>

          <div className="text-2xl font-bold">
            {result.category || "—"}
          </div>
        </div>
      </div>

      <p className="text-sm text-black/50 leading-6">
        BMI is a simple screening estimate and does not replace professional
        medical advice.
      </p>
    </div>
  );
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  }

  if (bmi >= 30) {
    return "Obesity range";
  }

  return "Normal weight";
}