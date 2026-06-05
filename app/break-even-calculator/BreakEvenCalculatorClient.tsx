"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export default function BreakEvenCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [sellingPrice, setSellingPrice] = useState(49);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(22);
  const [fixedCosts, setFixedCosts] = useState(5000);
  const [targetProfit, setTargetProfit] = useState(2500);
  const [expectedUnits, setExpectedUnits] = useState(300);
  const [taxRate, setTaxRate] = useState(0);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      sellingPrice < 0 ||
      variableCostPerUnit < 0 ||
      fixedCosts < 0 ||
      targetProfit < 0 ||
      expectedUnits < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const contributionMargin = sellingPrice - variableCostPerUnit;

    if (contributionMargin <= 0) {
      return null;
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * sellingPrice;

    const targetProfitBeforeTax =
      taxRate >= 100 ? targetProfit : targetProfit / (1 - taxRate / 100);

    const targetUnits = Math.ceil(
      (fixedCosts + targetProfitBeforeTax) / contributionMargin
    );

    const expectedRevenue = expectedUnits * sellingPrice;
    const expectedVariableCosts = expectedUnits * variableCostPerUnit;
    const expectedPreTaxProfit =
      expectedRevenue - expectedVariableCosts - fixedCosts;
    const expectedTax =
      expectedPreTaxProfit > 0 ? expectedPreTaxProfit * (taxRate / 100) : 0;
    const expectedNetProfit = expectedPreTaxProfit - expectedTax;

    return {
      contributionMargin,
      contributionMarginRatio:
        sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0,
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue: targetUnits * sellingPrice,
      expectedRevenue,
      expectedVariableCosts,
      expectedPreTaxProfit,
      expectedTax,
      expectedNetProfit,
      safetyMarginUnits: expectedUnits - breakEvenUnits,
      safetyMarginPercent:
        expectedUnits > 0
          ? ((expectedUnits - breakEvenUnits) / expectedUnits) * 100
          : 0,
    };
  }, [
    sellingPrice,
    variableCostPerUnit,
    fixedCosts,
    targetProfit,
    expectedUnits,
    taxRate,
  ]);

  function validateInputs() {
    if (
      sellingPrice < 0 ||
      variableCostPerUnit < 0 ||
      fixedCosts < 0 ||
      targetProfit < 0 ||
      expectedUnits < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (taxRate < 0 || taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    if (sellingPrice <= variableCostPerUnit) {
      setError("Selling price must be higher than variable cost per unit.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setSellingPrice(49);
    setVariableCostPerUnit(22);
    setFixedCosts(5000);
    setTargetProfit(2500);
    setExpectedUnits(300);
    setTaxRate(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate break-even point
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate how many units you need to sell to cover fixed costs, reach
          target profit and understand contribution margin.
        </p>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">Currency</span>

          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="CHF">CHF</option>
            <option value="JPY">JPY</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberInput label="Selling price per unit" value={sellingPrice} onChange={setSellingPrice} onBlur={validateInputs} />
          <NumberInput label="Variable cost per unit" value={variableCostPerUnit} onChange={setVariableCostPerUnit} onBlur={validateInputs} />
          <NumberInput label="Fixed costs" value={fixedCosts} onChange={setFixedCosts} onBlur={validateInputs} />
          <NumberInput label="Target profit after tax" value={targetProfit} onChange={setTargetProfit} onBlur={validateInputs} />
          <NumberInput label="Expected units sold" value={expectedUnits} onChange={setExpectedUnits} onBlur={validateInputs} />
          <NumberInput label="Tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
        </div>

        {error && <ToolErrorBox message={error} />}

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 sm:w-fit"
        >
          Reset example
        </button>
      </div>

      {result ? (
        <ToolResultBox title="Break-even result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard label="Break-even units" value={String(result.breakEvenUnits)} highlight />
            <ResultCard label="Break-even revenue" value={formatCurrency(result.breakEvenRevenue, currency)} />
            <ResultCard label="Contribution margin" value={formatCurrency(result.contributionMargin, currency)} />
            <ResultCard label="Contribution margin ratio" value={formatPercent(result.contributionMarginRatio)} />
            <ResultCard label="Units for target profit" value={String(result.targetUnits)} />
            <ResultCard label="Revenue for target profit" value={formatCurrency(result.targetRevenue, currency)} />
            <ResultCard label="Expected revenue" value={formatCurrency(result.expectedRevenue, currency)} />
            <ResultCard label="Expected net profit" value={formatCurrency(result.expectedNetProfit, currency)} />
            <ResultCard label="Expected tax" value={formatCurrency(result.expectedTax, currency)} />
            <ResultCard label="Safety margin units" value={String(result.safetyMarginUnits)} />
            <ResultCard label="Safety margin %" value={formatPercent(result.safetyMarginPercent)} />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            You need to sell{" "}
            <strong className="text-black">{result.breakEvenUnits}</strong>{" "}
            units to break even, generating{" "}
            <strong className="text-black">
              {formatCurrency(result.breakEvenRevenue, currency)}
            </strong>{" "}
            in revenue.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Selling price must be higher than variable cost per unit to calculate
          a break-even point.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Break-even analysis works best when fixed costs and variable costs are
        separated clearly. It helps estimate risk before launching products,
        campaigns or services.
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

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 text-xl font-black">{value}</div>
    </div>
  );
}