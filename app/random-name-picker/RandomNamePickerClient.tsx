"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PickMode = "single" | "multiple" | "teams";

function shuffleArray<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function parseNames(value: string, trimNames: boolean, removeDuplicates: boolean) {
  let names = value
    .split(/\n|,/)
    .map((name) => (trimNames ? name.trim() : name))
    .filter((name) => name.trim().length > 0);

  if (removeDuplicates) {
    const seen = new Set<string>();

    names = names.filter((name) => {
      const key = name.toLowerCase();

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }

  return names;
}

export default function RandomNamePickerClient() {
  const [namesText, setNamesText] = useState(
    "Emma\nLiam\nOlivia\nNoah\nAva\nLucas\nMia\nEthan\nSophia\nAlex"
  );
  const [pickMode, setPickMode] = useState<PickMode>("single");
  const [pickCount, setPickCount] = useState(3);
  const [teamCount, setTeamCount] = useState(2);
  const [trimNames, setTrimNames] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [allowRepeatWinners, setAllowRepeatWinners] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const names = parseNames(namesText, trimNames, removeDuplicates);

    if (!names.length) {
      return null;
    }

    if (pickCount <= 0 || teamCount <= 0) {
      return null;
    }

    const shuffled = shuffleArray(names);

    if (pickMode === "single") {
      return {
        names,
        winners: [shuffled[0]],
        teams: [],
      };
    }

    if (pickMode === "multiple") {
      const winners = allowRepeatWinners
        ? Array.from({ length: pickCount }, () => names[Math.floor(Math.random() * names.length)])
        : shuffled.slice(0, Math.min(pickCount, names.length));

      return {
        names,
        winners,
        teams: [],
      };
    }

    const teams = Array.from({ length: teamCount }, () => [] as string[]);

    shuffled.forEach((name, index) => {
      teams[index % teamCount].push(name);
    });

    return {
      names,
      winners: [],
      teams,
    };
  }, [
    namesText,
    trimNames,
    removeDuplicates,
    pickMode,
    pickCount,
    teamCount,
    allowRepeatWinners,
    spinKey,
  ]);

  function validateInputs() {
    const names = parseNames(namesText, trimNames, removeDuplicates);

    if (!names.length) {
      setError("Add at least one name.");
      return false;
    }

    if (pickCount <= 0 || teamCount <= 0) {
      setError("Pick count and team count must be greater than zero.");
      return false;
    }

    if (!allowRepeatWinners && pickMode === "multiple" && pickCount > names.length) {
      setError("Pick count cannot be higher than available names unless repeats are allowed.");
      return false;
    }

    if (pickMode === "teams" && teamCount > names.length) {
      setError("Team count should not be higher than the number of names.");
      return false;
    }

    setError("");
    return true;
  }

  function pickAgain() {
    if (validateInputs()) {
      setSpinKey((current) => current + 1);
    }
  }

  async function copyResult() {
    if (!result) return;

    const output =
      pickMode === "teams"
        ? result.teams
            .map((team, index) => `Team ${index + 1}: ${team.join(", ")}`)
            .join("\n")
        : result.winners.join("\n");

    await navigator.clipboard.writeText(output);
  }

  function resetExample() {
    setNamesText("Emma\nLiam\nOlivia\nNoah\nAva\nLucas\nMia\nEthan\nSophia\nAlex");
    setPickMode("single");
    setPickCount(3);
    setTeamCount(2);
    setTrimNames(true);
    setRemoveDuplicates(true);
    setAllowRepeatWinners(false);
    setSpinKey((current) => current + 1);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Pick random names
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Pick one winner, multiple winners or create random teams from a list of
          names.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Names</span>

          <textarea
            value={namesText}
            onChange={(event) => {
              setNamesText(event.target.value);
              setError("");
            }}
            onBlur={validateInputs}
            className="mt-3 min-h-[240px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
            placeholder="Enter one name per line or comma-separated names..."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-bold text-black">Mode</span>

            <select
              value={pickMode}
              onChange={(event) => {
                setPickMode(event.target.value as PickMode);
                setError("");
              }}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="single">Pick one winner</option>
              <option value="multiple">Pick multiple winners</option>
              <option value="teams">Create teams</option>
            </select>
          </label>

          <NumberInput label="Winners to pick" value={pickCount} onChange={setPickCount} onBlur={validateInputs} />
          <NumberInput label="Number of teams" value={teamCount} onChange={setTeamCount} onBlur={validateInputs} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Trim names" checked={trimNames} onChange={setTrimNames} />
          <Toggle label="Remove duplicates" checked={removeDuplicates} onChange={setRemoveDuplicates} />
          <Toggle label="Allow repeat winners" checked={allowRepeatWinners} onChange={setAllowRepeatWinners} />
        </div>

        {error && <ToolErrorBox message={error} />}
      </div>

      {result ? (
        <ToolResultBox title="Random result">
          {pickMode === "teams" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.teams.map((team, index) => (
                <div key={index} className="rounded-2xl border border-black/10 bg-white p-5">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Team {index + 1}
                  </div>

                  <div className="mt-3 grid gap-2 text-sm font-bold text-black">
                    {team.map((name) => (
                      <div key={name}>{name}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {result.winners.map((winner, index) => (
                <div
                  key={`${winner}-${index}`}
                  className="rounded-2xl border border-black bg-black px-5 py-4 text-lg font-black text-white"
                >
                  {winner}
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ResultCard label="Names available" value={result.names.length.toLocaleString()} />
            <ResultCard label="Mode" value={pickMode} />
            <ResultCard label="Generated" value={new Date().toLocaleTimeString()} />
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>Add names to generate a random result.</ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={pickAgain} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
          Pick again
        </button>

        <button type="button" onClick={copyResult} disabled={!result} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50">
          Copy result
        </button>

        <button type="button" onClick={resetExample} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        Useful for classroom picks, giveaways, raffles, meeting icebreakers,
        team assignments and random decision making.
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-black"
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