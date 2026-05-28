"use client";

import { useEffect, useState } from "react";

export default function PomodoroTimerClient() {
  const [secondsLeft, setSecondsLeft] =
    useState(25 * 60);

  const [isRunning, setIsRunning] =
    useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(
    secondsLeft / 60
  );

  const seconds =
    secondsLeft % 60;

  const formattedTime = `${String(
    minutes
  ).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const resetTimer = () => {
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div className="grid gap-10">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Pomodoro Timer
        </h2>

        <p className="text-black/60 leading-7">
          Use the Pomodoro technique to improve focus, productivity and study sessions.
        </p>
      </div>

      <div className="bg-white border border-black/10 rounded-[2rem] p-12 text-center">
        <div className="text-6xl md:text-7xl font-bold tracking-tight">
          {formattedTime}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            setIsRunning(true)
          }
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold hover:opacity-90 transition"
        >
          Start
        </button>

        <button
          onClick={() =>
            setIsRunning(false)
          }
          className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
        >
          Pause
        </button>

        <button
          onClick={resetTimer}
          className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}