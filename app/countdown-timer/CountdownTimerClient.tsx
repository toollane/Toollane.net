"use client";

import { useEffect, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function CountdownTimerClient() {
  const [minutesInput, setMinutesInput] = useState("5");
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const setTimer = () => {
    const minutes = parseFloat(minutesInput);

    if (isNaN(minutes) || minutes <= 0) {
      return;
    }

    setSecondsLeft(Math.round(minutes * 60));
    setIsRunning(false);
  };

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;

  const formattedTime = `${String(displayMinutes).padStart(2, "0")}:${String(
    displaySeconds
  ).padStart(2, "0")}`;

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Countdown Timer</h2>

        <p className="text-black/60 leading-7">
          Set a countdown timer for focus sessions, workouts, cooking, studying and daily tasks.
        </p>
      </div>

      <NumberInput
        label="Timer Length (Minutes)"
        value={minutesInput}
        onChange={setMinutesInput}
        placeholder="5"
        hint="You can enter partial minutes, for example 2.5."
      />

      <button
        onClick={setTimer}
        className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
      >
        Set Timer
      </button>

      <div className="bg-white border border-black/10 rounded-[2rem] p-12 text-center">
        <div className="text-6xl md:text-7xl font-bold tracking-tight">
          {formattedTime}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
        >
          Start
        </button>

        <button
          onClick={() => setIsRunning(false)}
          className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
        >
          Pause
        </button>

        <button
          onClick={() => {
            setSecondsLeft(0);
            setIsRunning(false);
          }}
          className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}