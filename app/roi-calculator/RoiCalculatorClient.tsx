"use client";

import { useMemo, useState } from "react";

export default function RoiCalculatorClient() {
  const [investment, setInvestment] =
    useState("");

  const [returnValue, setReturnValue] =
    useState("");

  const result = useMemo(() => {
    const initial =
      parseFloat(investment);

    const final =
      parseFloat(returnValue);

    if (
      isNaN(initial) ||
      isNaN(final) ||
      initial <= 0
    ) {
      return {
        profit: "",
        roi: "",
        totalReturn: "",
      };
    }

    const profit =
      final - initial;

    const roi =
      (profit / initial) * 100;

    return {
      profit:
        profit.toFixed(2),

      roi:
        roi.toFixed(2),

      totalReturn:
        final.toFixed(2),
    };
  }, [investment, returnValue]);

  return (
    <div className="grid gap-8">

      {/* INTRO */}

      <div className="space-y-3">

        <h2 className="text-2xl font-bold">
          Calculate Return on Investment
        </h2>

        <p className="text-black/60 leading-7">
          Estimate investment performance by calculating total profit and ROI percentage.
        </p>

      </div>



      {/* INPUTS */}

      <div className="grid gap-6">

        <div>
          <label className="block mb-2 font-medium">
            Initial Investment (USD)
          </label>

          <input
            type="number"
            value={investment}
            onChange={(e) =>
              setInvestment(e.target.value)
            }
            placeholder="1000"
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Final Value (USD)
          </label>

          <input
            type="number"
            value={returnValue}
            onChange={(e) =>
              setReturnValue(e.target.value)
            }
            placeholder="1500"
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>

      </div>



      {/* RESULTS */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Profit
          </div>

          <div className="text-3xl font-bold">
            ${result.profit || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            ROI
          </div>

          <div className="text-3xl font-bold">
            {result.roi || "0"}%
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Total Return
          </div>

          <div className="text-3xl font-bold">
            ${result.totalReturn || "0"}
          </div>

        </div>

      </div>



      {/* INFO */}

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">

        <h3 className="font-semibold mb-3">
          What ROI means
        </h3>

        <p className="text-black/60 leading-7">
          ROI (Return on Investment) measures how profitable an investment is compared to its original cost. Higher ROI percentages indicate stronger returns.
        </p>

      </div>

    </div>
  );
}