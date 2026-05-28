"use client";

import { useState } from "react";

export default function RandomNamePickerClient() {
  const [names, setNames] = useState("");
  const [selectedName, setSelectedName] =
    useState("");

  const pickRandomName = () => {
    const nameList = names
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    if (!nameList.length) {
      setSelectedName("");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * nameList.length
    );

    setSelectedName(
      nameList[randomIndex]
    );
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Pick a Random Name
        </h2>

        <p className="text-black/60 leading-7">
          Randomly choose names for classrooms, giveaways, raffles, teams and group activities.
        </p>
      </div>

      <textarea
        value={names}
        onChange={(e) =>
          setNames(e.target.value)
        }
        placeholder="Enter one name per line..."
        rows={10}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={pickRandomName}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
      >
        Pick Random Name
      </button>

      <div className="bg-white border border-black/10 rounded-3xl p-8 text-center">
        <div className="text-sm text-black/50 mb-3">
          Selected Name
        </div>

        <div className="text-4xl font-bold break-words">
          {selectedName || "—"}
        </div>
      </div>
    </div>
  );
}