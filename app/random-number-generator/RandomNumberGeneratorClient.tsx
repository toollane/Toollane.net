"use client";

import { useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function RandomNumberGeneratorClient() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");

  const [result, setResult] =
    useState<number | null>(null);

  const generateNumber = () => {
    const minNumber =
      parseInt(min, 10);

    const maxNumber =
      parseInt(max, 10);

    if (
      isNaN(minNumber) ||
      isNaN(maxNumber) ||
      minNumber > maxNumber
    ) {
      setResult(null);
      return;
    }

    const random =
      Math.floor(
        Math.random() *
          (maxNumber -
            minNumber +
            1)
      ) + minNumber;

    setResult(random);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Generate Random Numbers
        </h2>

        <p className="text-black/60 leading-7">
          Generate random numbers instantly for games, raffles, classrooms, coding and productivity tasks.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Minimum Number"
          value={min}
          onChange={setMin}
          placeholder="1"
        />

        <NumberInput
          label="Maximum Number"
          value={max}
          onChange={setMax}
          placeholder="100"
        />
      </div>

      <button
        onClick={generateNumber}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
      >
        Generate Number
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-8 text-center">
        <div className="text-sm text-black/50 mb-3">
          Random Number
        </div>

        <div className="text-5xl font-bold">
          {result ?? "—"}
        </div>
      </div>
    </div>
  );
}