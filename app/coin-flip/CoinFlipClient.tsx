"use client";

import { useMemo, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CoinSide = "Heads" | "Tails";

function flipCoin(): CoinSide {
  return Math.random() < 0.5 ? "Heads" : "Tails";
}

export default function CoinFlipClient() {
  const [flipCount, setFlipCount] = useState(1);
  const [history, setHistory] = useState<CoinSide[]>([]);

  const stats = useMemo(() => {
    const heads = history.filter((side) => side === "Heads").length;
    const tails = history.filter((side) => side === "Tails").length;
    const total = history.length;

    return {
      heads,
      tails,
      total,
      headsPercent: total ? (heads / total) * 100 : 0,
      tailsPercent: total ? (tails / total) * 100 : 0,
      latest: history[0] ?? null,
      longestHeadsStreak: getLongestStreak(history, "Heads"),
      longestTailsStreak: getLongestStreak(history, "Tails"),
    };
  }, [history]);

  function flip() {
    const safeCount = Math.min(Math.max(flipCount, 1), 1000);
    const newFlips = Array.from({ length: safeCount }, flipCoin);

    setHistory((current) => [...newFlips, ...current]);
  }

  function clearHistory() {
    setHistory([]);
  }

  async function copyHistory() {
    await navigator.clipboard.writeText(history.join("\n"));
  }

  function resetExample() {
    setFlipCount(1);
    setHistory([]);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Flip a coin online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Flip one or many coins, track results, view percentages and analyze
          coin flip history.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Number of flips</span>

        <input
          type="number"
          min="1"
          max="1000"
          value={flipCount}
          onChange={(event) => setFlipCount(Number(event.target.value))}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />
      </label>

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center">
        <div className="text-xs font-bold uppercase tracking-wide text-black/40">
          Latest result
        </div>

        <div className="mt-4 text-5xl font-black text-black">
          {stats.latest ?? "Flip"}
        </div>
      </div>

      <ToolResultBox title="Coin flip statistics">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="Total flips" value={stats.total.toLocaleString()} />
          <ResultCard label="Heads" value={`${stats.heads.toLocaleString()} (${stats.headsPercent.toFixed(1)}%)`} />
          <ResultCard label="Tails" value={`${stats.tails.toLocaleString()} (${stats.tailsPercent.toFixed(1)}%)`} />
          <ResultCard label="Longest heads streak" value={stats.longestHeadsStreak.toLocaleString()} />
          <ResultCard label="Longest tails streak" value={stats.longestTailsStreak.toLocaleString()} />
          <ResultCard label="Last 10 flips" value={history.slice(0, 10).join(", ") || "None"} />
        </div>
      </ToolResultBox>

      {history.length > 0 && (
        <ToolResultBox title="Flip history">
          <div className="flex max-h-[240px] flex-wrap gap-2 overflow-auto">
            {history.map((side, index) => (
              <span
                key={`${side}-${index}`}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black"
              >
                {side}
              </span>
            ))}
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={flip} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Flip coin
        </button>

        <button type="button" onClick={copyHistory} disabled={!history.length} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50">
          Copy history
        </button>

        <button type="button" onClick={clearHistory} disabled={!history.length} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50">
          Clear history
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Coin flips use browser randomness and are useful for quick decisions,
        simulations, games and probability demonstrations.
      </ToolInfoBox>
    </div>
  );
}

function getLongestStreak(history: CoinSide[], target: CoinSide) {
  let longest = 0;
  let current = 0;

  history.forEach((side) => {
    if (side === target) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  });

  return longest;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">{label}</div>
      <div className="mt-2 break-words text-xl font-black text-black">{value}</div>
    </div>
  );
}