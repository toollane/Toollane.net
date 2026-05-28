"use client";

import { useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function DiceRollerClient() {
  const [sides, setSides] = useState("6");
  const [result, setResult] = useState<number | null>(null);

  const rollDice = () => {
    const sideCount = parseInt(sides, 10);

    if (isNaN(sideCount) || sideCount <= 1) {
      setResult(null);
      return;
    }

    setResult(Math.floor(Math.random() * sideCount) + 1);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Roll a Dice</h2>

        <p className="text-black/60 leading-7">
          Roll a virtual dice instantly for games, classrooms, decisions and random picks.
        </p>
      </div>

      <NumberInput
        label="Number of Sides"
        value={sides}
        onChange={setSides}
        placeholder="6"
      />

      <button
        onClick={rollDice}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
      >
        Roll Dice
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-8 text-center">
        <div className="text-sm text-black/50 mb-3">Result</div>

        <div className="text-6xl font-bold">
          {result ?? "—"}
        </div>
      </div>
    </div>
  );
}