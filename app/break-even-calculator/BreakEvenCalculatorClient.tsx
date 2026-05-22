"use client";

import { useMemo, useState } from "react";

import NumberInput from "@/components/NumberInput";

const currencies = [
  { label: "USD ($)", symbol: "$" },
  { label: "EUR (€)", symbol: "€" },
  { label: "GBP (£)", symbol: "£" },
  { label: "CAD ($)", symbol: "$" },
  { label: "AUD ($)", symbol: "$" },
];

export default function BreakEvenCalculatorClient() {
  const [currency, setCurrency] = useState(currencies[0]);
  const [fixedCosts, setFixedCosts] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

  const result = useMemo(() => {
    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(pricePerUnit);
    const variable = parseFloat(variableCostPerUnit);

    if (
      isNaN(fixed) ||
      isNaN(price) ||
      isNaN(variable) ||
      fixed < 0 ||
      price <= 0 ||
      variable < 0 ||
      price <= variable
    ) {
      return {
        breakEvenUnits: "",
        breakEvenRevenue: "",
        contributionMargin: "",
      };
    }

    const contributionMargin = price - variable;
    const breakEvenUnits = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;

    return {
      breakEvenUnits: breakEvenUnits.toFixed(0),
      breakEvenRevenue: breakEvenRevenue.toFixed(2),
      contributionMargin: contributionMargin.toFixed(2),
    };
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Calculate Break-Even Point
        </h2>

        <p className="text-black/60 leading-7">
          Find out how many units you need to sell to cover your fixed and
          variable costs.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Currency
        </label>

        <select
          value={currency.label}
          onChange={(e) => {
            const selected = currencies.find(
              (item) => item.label === e.target.value
            );

            if (selected) {
              setCurrency(selected);
            }
          }}
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        >
          {currencies.map((item) => (
            <option key={item.label} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        <NumberInput
          label="Fixed Costs"
          value={fixedCosts}
          onChange={setFixedCosts}
          placeholder="10000"
        />

        <NumberInput
          label="Price per Unit"
          value={pricePerUnit}
          onChange={setPricePerUnit}
          placeholder="50"
        />

        <NumberInput
          label="Variable Cost per Unit"
          value={variableCostPerUnit}
          onChange={setVariableCostPerUnit}
          placeholder="20"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Break-Even Units
          </div>

          <div className="text-3xl font-bold">
            {result.breakEvenUnits || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Break-Even Revenue
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.breakEvenRevenue || "0"}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="text-sm text-black/50 mb-2">
            Contribution Margin
          </div>

          <div className="text-3xl font-bold">
            {currency.symbol}{result.contributionMargin || "0"}
          </div>
        </div>
      </div>

      <div className="bg-white/60 border border-black/10 rounded-3xl p-6">
        <h3 className="font-semibold mb-3">
          Break-even formula
        </h3>

        <p className="text-black/60 leading-7">
          Break-even units are calculated by dividing fixed costs by contribution
          margin per unit. Contribution margin is price per unit minus variable
          cost per unit.
        </p>
      </div>
    </div>
  );
}