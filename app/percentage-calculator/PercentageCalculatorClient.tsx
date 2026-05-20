"use client";

import { useState } from "react";

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState("basic");



  // BASIC PERCENTAGE

  const [percentage, setPercentage] =
    useState("");

  const [number, setNumber] =
    useState("");

  const [basicResult, setBasicResult] =
    useState("");



  // INCREASE

  const [increaseFrom, setIncreaseFrom] =
    useState("");

  const [increaseTo, setIncreaseTo] =
    useState("");

  const [increaseResult, setIncreaseResult] =
    useState("");



  // DECREASE

  const [decreaseFrom, setDecreaseFrom] =
    useState("");

  const [decreaseTo, setDecreaseTo] =
    useState("");

  const [decreaseResult, setDecreaseResult] =
    useState("");



  function calculateBasic(
    percent: string,
    value: string
  ) {
    setPercentage(percent);
    setNumber(value);

    const percentNumber =
      parseFloat(percent);

    const valueNumber =
      parseFloat(value);

    if (
      isNaN(percentNumber) ||
      isNaN(valueNumber)
    ) {
      setBasicResult("");
      return;
    }

    const calculated =
      (percentNumber / 100) *
      valueNumber;

    setBasicResult(calculated.toFixed(2));
  }



  function calculateIncrease(
    from: string,
    to: string
  ) {
    setIncreaseFrom(from);
    setIncreaseTo(to);

    const fromNumber = parseFloat(from);
    const toNumber = parseFloat(to);

    if (
      isNaN(fromNumber) ||
      isNaN(toNumber)
    ) {
      setIncreaseResult("");
      return;
    }

    const calculated =
      ((toNumber - fromNumber) /
        fromNumber) *
      100;

    setIncreaseResult(
      calculated.toFixed(2)
    );
  }



  function calculateDecrease(
    from: string,
    to: string
  ) {
    setDecreaseFrom(from);
    setDecreaseTo(to);

    const fromNumber = parseFloat(from);
    const toNumber = parseFloat(to);

    if (
      isNaN(fromNumber) ||
      isNaN(toNumber)
    ) {
      setDecreaseResult("");
      return;
    }

    const calculated =
      ((fromNumber - toNumber) /
        fromNumber) *
      100;

    setDecreaseResult(
      calculated.toFixed(2)
    );
  }

  return (
    <div className="border rounded-2xl p-8 shadow-sm">

      {/* TABS */}

      <div className="flex flex-wrap gap-3 mb-8">

        <button
          onClick={() =>
            setMode("basic")
          }
          className={`px-4 py-2 rounded-xl border ${
            mode === "basic"
              ? "bg-black text-white"
              : ""
          }`}
        >
          Basic %
        </button>

        <button
          onClick={() =>
            setMode("increase")
          }
          className={`px-4 py-2 rounded-xl border ${
            mode === "increase"
              ? "bg-black text-white"
              : ""
          }`}
        >
          Increase %
        </button>

        <button
          onClick={() =>
            setMode("decrease")
          }
          className={`px-4 py-2 rounded-xl border ${
            mode === "decrease"
              ? "bg-black text-white"
              : ""
          }`}
        >
          Decrease %
        </button>

      </div>



      {/* BASIC */}

      {mode === "basic" && (
        <div className="grid gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Percentage
            </label>

            <input
              type="number"
              value={percentage}
              onChange={(e) =>
                calculateBasic(
                  e.target.value,
                  number
                )
              }
              placeholder="Enter percentage"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Number
            </label>

            <input
              type="number"
              value={number}
              onChange={(e) =>
                calculateBasic(
                  percentage,
                  e.target.value
                )
              }
              placeholder="Enter number"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Result
            </label>

            <input
              type="text"
              value={basicResult}
              readOnly
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

        </div>
      )}



      {/* INCREASE */}

      {mode === "increase" && (
        <div className="grid gap-6">

          <div>
            <label className="block mb-2 font-medium">
              From
            </label>

            <input
              type="number"
              value={increaseFrom}
              onChange={(e) =>
                calculateIncrease(
                  e.target.value,
                  increaseTo
                )
              }
              placeholder="Starting value"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              To
            </label>

            <input
              type="number"
              value={increaseTo}
              onChange={(e) =>
                calculateIncrease(
                  increaseFrom,
                  e.target.value
                )
              }
              placeholder="Ending value"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Increase %
            </label>

            <input
              type="text"
              value={increaseResult}
              readOnly
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

        </div>
      )}



      {/* DECREASE */}

      {mode === "decrease" && (
        <div className="grid gap-6">

          <div>
            <label className="block mb-2 font-medium">
              From
            </label>

            <input
              type="number"
              value={decreaseFrom}
              onChange={(e) =>
                calculateDecrease(
                  e.target.value,
                  decreaseTo
                )
              }
              placeholder="Starting value"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              To
            </label>

            <input
              type="number"
              value={decreaseTo}
              onChange={(e) =>
                calculateDecrease(
                  decreaseFrom,
                  e.target.value
                )
              }
              placeholder="Ending value"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Decrease %
            </label>

            <input
              type="text"
              value={decreaseResult}
              readOnly
              className="w-full border rounded-xl px-4 py-3 bg-gray-100"
            />
          </div>

        </div>
      )}

    </div>
  );
}