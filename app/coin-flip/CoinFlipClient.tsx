"use client";

import { useState } from "react";

export default function CoinFlipClient() {
  const [result, setResult] = useState("");

  const flipCoin = () => {
    setResult(Math.random() < 0.5 ? "Heads" : "Tails");
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Flip a Coin</h2>

        <p className="text-black/60 leading-7">
          Flip a virtual coin instantly for quick decisions, games and random choices.
        </p>
      </div>

      <button
        onClick={flipCoin}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
      >
        Flip Coin
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-8 text-center">
        <div className="text-sm text-black/50 mb-3">Result</div>

        <div className="text-6xl font-bold">
          {result || "—"}
        </div>
      </div>
    </div>
  );
}