"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function MarginMarkupCalculatorClient() {
  const [costPrice, setCostPrice] =
    useState("");

  const [sellingPrice, setSellingPrice] =
    useState("");

  const calculations = useMemo(() => {
    const cost =
      parseFloat(costPrice);

    const selling =
      parseFloat(sellingPrice);

    if (
      isNaN(cost) ||
      isNaN(selling) ||
      cost <= 0
    ) {
      return {
        margin: "",
        markup: "",
        profit: "",
      };
    }

    const profit =
      selling - cost;

    const margin =
      (profit / selling) * 100;

    const markup =
      (profit / cost) * 100;

    return {
      profit:
        profit.toFixed(2),

      margin:
        margin.toFixed(2),

      markup:
        markup.toFixed(2),
    };
  }, [costPrice, sellingPrice]);

  return (
    <div className="grid gap-8">

      {/* INTRO */}

      <div className="space-y-3">

        <h2 className="text-2xl font-bold">
          Calculate Margin & Markup
        </h2>

        <p className="text-black/60 leading-7">
          Calculate profit margin, markup percentage and total profit instantly for products, services and investments.
        </p>

      </div>



      {/* INPUTS */}

      <div className="grid gap-6">

        <NumberInput
          label="Cost Price (USD)"
          value={costPrice}
          onChange={setCostPrice}
          placeholder="100"
        />

        <NumberInput
          label="Selling Price (USD)"
          value={sellingPrice}
          onChange={setSellingPrice}
          placeholder="150"
        />

      </div>



      {/* RESULTS */}

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Profit
          </div>

          <div className="text-3xl font-bold">
            ${calculations.profit || "0"}
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Margin
          </div>

          <div className="text-3xl font-bold">
            {calculations.margin || "0"}%
          </div>

        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">

          <div className="text-sm text-black/50 mb-2">
            Markup
          </div>

          <div className="text-3xl font-bold">
            {calculations.markup || "0"}%
          </div>

        </div>

      </div>



      {/* INFO */}

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">

        <h3 className="font-semibold mb-3">
          Margin vs Markup
        </h3>

        <p className="text-black/60 leading-7">
          Margin measures profit relative to the selling price, while markup measures profit relative to the original cost. Businesses use both metrics to evaluate pricing and profitability.
        </p>

      </div>

    </div>
  );
}