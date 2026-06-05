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

export default function ProfitPerUnitCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [sellingPrice, setSellingPrice] = useState(49);
  const [productCost, setProductCost] = useState(18);
  const [shippingCost, setShippingCost] = useState(5);
  const [packagingCost, setPackagingCost] = useState(1.5);
  const [platformFeePercent, setPlatformFeePercent] = useState(2.9);
  const [platformFeeFixed, setPlatformFeeFixed] = useState(0.3);
  const [adCostPerUnit, setAdCostPerUnit] = useState(6);
  const [returnRate, setReturnRate] = useState(5);
  const [refundLossPerReturn, setRefundLossPerReturn] = useState(12);
  const [taxRate, setTaxRate] = useState(0);
  const [unitsSold, setUnitsSold] = useState(100);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      sellingPrice < 0 ||
      productCost < 0 ||
      shippingCost < 0 ||
      packagingCost < 0 ||
      platformFeePercent < 0 ||
      platformFeeFixed < 0 ||
      adCostPerUnit < 0 ||
      returnRate < 0 ||
      returnRate > 100 ||
      refundLossPerReturn < 0 ||
      taxRate < 0 ||
      taxRate > 100 ||
      unitsSold < 0
    ) {
      return null;
    }

    const platformFee = sellingPrice * (platformFeePercent / 100) + platformFeeFixed;
    const expectedReturnCost = refundLossPerReturn * (returnRate / 100);

    const totalVariableCost =
      productCost +
      shippingCost +
      packagingCost +
      platformFee +
      adCostPerUnit +
      expectedReturnCost;

    const preTaxProfitPerUnit = sellingPrice - totalVariableCost;
    const taxPerUnit =
      preTaxProfitPerUnit > 0 ? preTaxProfitPerUnit * (taxRate / 100) : 0;
    const profitPerUnit = preTaxProfitPerUnit - taxPerUnit;

    const margin = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;
    const markup =
      totalVariableCost > 0 ? (profitPerUnit / totalVariableCost) * 100 : 0;

    const breakEvenPrice =
      totalVariableCost / Math.max(0.0001, 1 - taxRate / 100);

    return {
      platformFee,
      expectedReturnCost,
      totalVariableCost,
      preTaxProfitPerUnit,
      taxPerUnit,
      profitPerUnit,
      margin,
      markup,
      breakEvenPrice,
      totalRevenue: sellingPrice * unitsSold,
      totalProfit: profitPerUnit * unitsSold,
      totalCosts: totalVariableCost * unitsSold,
    };
  }, [
    sellingPrice,
    productCost,
    shippingCost,
    packagingCost,
    platformFeePercent,
    platformFeeFixed,
    adCostPerUnit,
    returnRate,
    refundLossPerReturn,
    taxRate,
    unitsSold,
  ]);

  function validateInputs() {
    if (
      sellingPrice < 0 ||
      productCost < 0 ||
      shippingCost < 0 ||
      packagingCost < 0 ||
      platformFeePercent < 0 ||
      platformFeeFixed < 0 ||
      adCostPerUnit < 0 ||
      refundLossPerReturn < 0 ||
      unitsSold < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (returnRate < 0 || returnRate > 100 || taxRate < 0 || taxRate > 100) {
      setError("Return rate and tax rate must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setSellingPrice(49);
    setProductCost(18);
    setShippingCost(5);
    setPackagingCost(1.5);
    setPlatformFeePercent(2.9);
    setPlatformFeeFixed(0.3);
    setAdCostPerUnit(6);
    setReturnRate(5);
    setRefundLossPerReturn(12);
    setTaxRate(0);
    setUnitsSold(100);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate profit per unit
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate real profit per unit with product cost, shipping,
          packaging, platform fees, ads, returns, taxes and sales volume.
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
          <NumberInput label="Selling price" value={sellingPrice} onChange={setSellingPrice} onBlur={validateInputs} />
          <NumberInput label="Product cost" value={productCost} onChange={setProductCost} onBlur={validateInputs} />
          <NumberInput label="Shipping cost" value={shippingCost} onChange={setShippingCost} onBlur={validateInputs} />
          <NumberInput label="Packaging cost" value={packagingCost} onChange={setPackagingCost} onBlur={validateInputs} />
          <NumberInput label="Platform fee %" value={platformFeePercent} onChange={setPlatformFeePercent} onBlur={validateInputs} />
          <NumberInput label="Fixed platform fee" value={platformFeeFixed} onChange={setPlatformFeeFixed} onBlur={validateInputs} />
          <NumberInput label="Ad cost per unit" value={adCostPerUnit} onChange={setAdCostPerUnit} onBlur={validateInputs} />
          <NumberInput label="Return rate %" value={returnRate} onChange={setReturnRate} onBlur={validateInputs} />
          <NumberInput label="Loss per return" value={refundLossPerReturn} onChange={setRefundLossPerReturn} onBlur={validateInputs} />
          <NumberInput label="Tax rate %" value={taxRate} onChange={setTaxRate} onBlur={validateInputs} />
          <NumberInput label="Units sold" value={unitsSold} onChange={setUnitsSold} onBlur={validateInputs} />
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
        <ToolResultBox title="Unit economics result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Profit per unit"
              value={formatCurrency(result.profitPerUnit, currency)}
              highlight
            />

            <ResultCard
              label="Margin"
              value={formatPercent(result.margin)}
            />

            <ResultCard
              label="Total variable cost"
              value={formatCurrency(result.totalVariableCost, currency)}
            />

            <ResultCard
              label="Platform fee"
              value={formatCurrency(result.platformFee, currency)}
            />

            <ResultCard
              label="Expected return cost"
              value={formatCurrency(result.expectedReturnCost, currency)}
            />

            <ResultCard
              label="Break-even price"
              value={formatCurrency(result.breakEvenPrice, currency)}
            />

            <ResultCard
              label="Total revenue"
              value={formatCurrency(result.totalRevenue, currency)}
            />

            <ResultCard
              label="Total profit"
              value={formatCurrency(result.totalProfit, currency)}
            />

            <ResultCard
              label="Total costs"
              value={formatCurrency(result.totalCosts, currency)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated profit per unit is{" "}
            <strong className="text-black">
              {formatCurrency(result.profitPerUnit, currency)}
            </strong>{" "}
            with a margin of{" "}
            <strong className="text-black">
              {formatPercent(result.margin)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid unit economics to calculate profit per sale.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        A useful unit profit calculation should include hidden costs such as
        platform fees, ads, returns, packaging and taxes — not only product cost.
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