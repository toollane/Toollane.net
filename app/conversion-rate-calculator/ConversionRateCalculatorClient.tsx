"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function ConversionRateCalculatorClient() {
  const [conversions, setConversions] = useState("");
  const [visitors, setVisitors] = useState("");

  const result = useMemo(() => {
    const conversionNumber = parseFloat(conversions);
    const visitorNumber = parseFloat(visitors);

    if (
      isNaN(conversionNumber) ||
      isNaN(visitorNumber) ||
      conversionNumber < 0 ||
      visitorNumber <= 0
    ) {
      return {
        conversionRate: "",
      };
    }

    return {
      conversionRate: ((conversionNumber / visitorNumber) * 100).toFixed(2),
    };
  }, [conversions, visitors]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Conversion Rate
        </h2>

        <p className="text-black/60 leading-7">
          Calculate the percentage of visitors, users or leads who complete a desired action.
        </p>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Conversions"
          value={conversions}
          onChange={setConversions}
          placeholder="250"
        />

        <NumberInput
          label="Visitors"
          value={visitors}
          onChange={setVisitors}
          placeholder="10000"
        />
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6">
        <div className="text-sm text-black/50 mb-2">
          Conversion Rate
        </div>

        <div className="text-3xl font-bold">
          {result.conversionRate || "0"}%
        </div>
      </div>
    </div>
  );
}