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

export default function ProfitCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [revenue, setRevenue] = useState(50000);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(18000);
  const [operatingExpenses, setOperatingExpenses] = useState(12000);
  const [marketingCosts, setMarketingCosts] = useState(4000);
  const [transactionFees, setTransactionFees] = useState(2.9);
  const [taxRate, setTaxRate] = useState(20);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      revenue < 0 ||
      costOfGoodsSold < 0 ||
      operatingExpenses < 0 ||
      marketingCosts < 0 ||
      transactionFees < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return null;
    }

    const transactionFeeAmount = revenue * (transactionFees / 100);
    const grossProfit = revenue - costOfGoodsSold;
    const totalExpenses =
      costOfGoodsSold + operatingExpenses + marketingCosts + transactionFeeAmount;
    const preTaxProfit = revenue - totalExpenses;
    const estimatedTax = preTaxProfit > 0 ? preTaxProfit * (taxRate / 100) : 0;
    const netProfit = preTaxProfit - estimatedTax;

    return {
      grossProfit,
      totalExpenses,
      transactionFeeAmount,
      preTaxProfit,
      estimatedTax,
      netProfit,
      grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
      netMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
      expenseRatio: revenue > 0 ? (totalExpenses / revenue) * 100 : 0,
    };
  }, [
    revenue,
    costOfGoodsSold,
    operatingExpenses,
    marketingCosts,
    transactionFees,
    taxRate,
  ]);

  function validateInputs() {
    if (
      revenue < 0 ||
      costOfGoodsSold < 0 ||
      operatingExpenses < 0 ||
      marketingCosts < 0
    ) {
      setError("Revenue and cost values cannot be negative.");
      return false;
    }

    if (transactionFees < 0) {
      setError("Transaction fee rate cannot be negative.");
      return false;
    }

    if (taxRate < 0 || taxRate > 100) {
      setError("Tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setRevenue(50000);
    setCostOfGoodsSold(18000);
    setOperatingExpenses(12000);
    setMarketingCosts(4000);
    setTransactionFees(2.9);
    setTaxRate(20);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate business profit
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate gross profit, net profit, margins, expenses, transaction fees
          and taxes for a product, service or business.
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
          <NumberInput label="Revenue" value={revenue} onChange={setRevenue} onBlur={validateInputs} />
          <NumberInput label="Cost of goods sold" value={costOfGoodsSold} onChange={setCostOfGoodsSold} onBlur={validateInputs} />
          <NumberInput label="Operating expenses" value={operatingExpenses} onChange={setOperatingExpenses} onBlur={validateInputs} />
          <NumberInput label="Marketing costs" value={marketingCosts} onChange={setMarketingCosts} onBlur={validateInputs} />
          <NumberInput label="Transaction fees %" value={transactionFees} onChange={setTransactionFees} onBlur={validateInputs} />
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
        <ToolResultBox title="Profit result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Net profit"
              value={formatCurrency(result.netProfit, currency)}
              highlight
            />

            <ResultCard
              label="Gross profit"
              value={formatCurrency(result.grossProfit, currency)}
            />

            <ResultCard
              label="Pre-tax profit"
              value={formatCurrency(result.preTaxProfit, currency)}
            />

            <ResultCard
              label="Total expenses"
              value={formatCurrency(result.totalExpenses, currency)}
            />

            <ResultCard
              label="Transaction fees"
              value={formatCurrency(result.transactionFeeAmount, currency)}
            />

            <ResultCard
              label="Estimated tax"
              value={formatCurrency(result.estimatedTax, currency)}
            />

            <ResultCard
              label="Gross margin"
              value={formatPercent(result.grossMargin)}
            />

            <ResultCard
              label="Net margin"
              value={formatPercent(result.netMargin)}
            />

            <ResultCard
              label="Expense ratio"
              value={formatPercent(result.expenseRatio)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated net profit is{" "}
            <strong className="text-black">
              {formatCurrency(result.netProfit, currency)}
            </strong>{" "}
            with a net margin of{" "}
            <strong className="text-black">
              {formatPercent(result.netMargin)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid revenue, cost and tax assumptions to calculate profit.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This calculator provides estimates only. Actual profit can vary due to
        refunds, discounts, local taxes, payroll, overhead, accounting methods
        and timing.
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