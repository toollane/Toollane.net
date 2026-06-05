"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type DicePreset = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100" | "custom";

type RollRecord = {
  id: string;
  diceCount: number;
  sides: number;
  modifier: number;
  rolls: number[];
  total: number;
  createdAt: string;
};

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function DiceRollerClient() {
  const [preset, setPreset] = useState<DicePreset>("d6");
  const [diceCount, setDiceCount] = useState(2);
  const [customSides, setCustomSides] = useState(6);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<RollRecord[]>([]);
  const [error, setError] = useState("");

  const sides = preset === "custom" ? customSides : Number(preset.replace("d", ""));

  const latest = history[0];

  const stats = useMemo(() => {
    if (!history.length) {
      return {
        rolls: 0,
        averageTotal: 0,
        highestTotal: 0,
        lowestTotal: 0,
      };
    }

    const totals = history.map((item) => item.total);

    return {
      rolls: history.length,
      averageTotal: totals.reduce((sum, total) => sum + total, 0) / totals.length,
      highestTotal: Math.max(...totals),
      lowestTotal: Math.min(...totals),
    };
  }, [history]);

  function validateInputs() {
    if (diceCount <= 0 || diceCount > 100) {
      setError("Dice count must be between 1 and 100.");
      return false;
    }

    if (sides <= 1 || sides > 1000) {
      setError("Dice sides must be between 2 and 1000.");
      return false;
    }

    setError("");
    return true;
  }

  function rollDice() {
    if (!validateInputs()) return;

    const rolls = Array.from({ length: diceCount }, () => rollDie(sides));
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

    setHistory((current) => [
      {
        id: crypto.randomUUID(),
        diceCount,
        sides,
        modifier,
        rolls,
        total,
        createdAt: new Date().toLocaleTimeString(),
      },
      ...current,
    ]);
  }

  function clearHistory() {
    setHistory([]);
  }

  async function copyHistory() {
    const output = history
      .map(
        (record) =>
          `${record.createdAt} — ${record.diceCount}d${record.sides}${record.modifier >= 0 ? "+" : ""}${record.modifier}: [${record.rolls.join(", ")}] = ${record.total}`
      )
      .join("\n");

    await navigator.clipboard.writeText(output);
  }

  function resetExample() {
    setPreset("d6");
    setDiceCount(2);
    setCustomSides(6);
    setModifier(0);
    setHistory([]);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Roll dice online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Roll standard or custom dice with modifiers, roll history and total
          statistics.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-black">Dice type</span>

            <select
              value={preset}
              onChange={(event) => {
                setPreset(event.target.value as DicePreset);
                setError("");
              }}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="d4">d4</option>
              <option value="d6">d6</option>
              <option value="d8">d8</option>
              <option value="d10">d10</option>
              <option value="d12">d12</option>
              <option value="d20">d20</option>
              <option value="d100">d100</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <NumberInput label="Dice count" value={diceCount} onChange={setDiceCount} onBlur={validateInputs} />
          <NumberInput label="Modifier" value={modifier} onChange={setModifier} onBlur={validateInputs} />

          {preset === "custom" && (
            <NumberInput label="Custom sides" value={customSides} onChange={setCustomSides} onBlur={validateInputs} />
          )}
        </div>

        {error && <ToolErrorBox message={error} />}
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-8 text-center">
        <div className="text-xs font-bold uppercase tracking-wide text-black/40">
          Latest total
        </div>

        <div className="mt-4 text-6xl font-black text-black">
          {latest ? latest.total : "—"}
        </div>

        {latest && (
          <div className="mt-4 text-sm leading-7 text-black/60">
            Rolls: {latest.rolls.join(", ")}
            {latest.modifier !== 0 && ` | Modifier: ${latest.modifier}`}
          </div>
        )}
      </div>

      <ToolResultBox title="Dice statistics">
        <div className="grid gap-4 sm:grid-cols-4">
          <ResultCard label="Rolls" value={stats.rolls.toLocaleString()} />
          <ResultCard label="Average total" value={stats.averageTotal.toFixed(2)} />
          <ResultCard label="Highest total" value={stats.highestTotal.toLocaleString()} />
          <ResultCard label="Lowest total" value={stats.lowestTotal.toLocaleString()} />
        </div>
      </ToolResultBox>

      {history.length > 0 && (
        <ToolResultBox title="Roll history">
          <div className="grid max-h-[360px] gap-3 overflow-auto">
            {history.map((record) => (
              <div key={record.id} className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  {record.createdAt} — {record.diceCount}d{record.sides}
                  {record.modifier >= 0 ? "+" : ""}
                  {record.modifier}
                </div>

                <div className="mt-2 text-xl font-black text-black">
                  Total: {record.total}
                </div>

                <div className="mt-2 text-sm text-black/60">
                  Rolls: {record.rolls.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={rollDice} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Roll dice
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
        Supports common tabletop dice such as d4, d6, d8, d10, d12, d20 and
        d100, plus custom dice sides and modifiers.
      </ToolInfoBox>
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
        onChange={(event) => onChange(Number(event.target.value))}
        onBlur={onBlur}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">{label}</div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}