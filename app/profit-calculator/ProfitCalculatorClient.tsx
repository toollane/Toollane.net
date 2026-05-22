"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function ProfitCalculatorClient() {
  const [revenue, setRevenue] = useState("");
  const [costs, setCosts] = useState("");

  const result = useMemo(() => {
    const revenueNumber = parseFloat(revenue);
    const costsNumber = parseFloat(costs);

    if (
      isNaN(revenueNumber) ||
      isNaN(costsNumber) ||
      revenueNumber < 0 ||
      costsNumber < 0
    ) {
      return {
        profit: "",
        profitMargin: "",
      };
    }

    const profit = revenueNumber - costsNumber;
    const profitMargin =
      revenueNumber > 0 ? (profit / revenueNumber) * 100 : 0;

    return {
      profit: profit.toFixed(2),
      profitMargin: profitMargin.toFixed(2),
    };
  }, [revenue, costs]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Profit
        </h2>

        <p className="text-black/60 leading-7">
          Enter your revenue and total costs to calculate profit and profit margin.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Revenue (USD)"
          value={revenue}
          onChange={setRevenue}
          placeholder="5000"
        />

        <NumberInput
          label="Total Costs (USD)"
          value={costs}
          onChange={setCosts}
          placeholder="3200"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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
            Profit Margin
          </div>

          <div className="text-3xl font-bold">
            {result.profitMargin || "0"}%
          </div>
        </div>
      </div>
    </div>
  );
}