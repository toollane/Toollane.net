"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type RevenueModel = "unit-sales" | "subscription" | "traffic";

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [model, setModel] = useState<RevenueModel>("subscription");

  const [price, setPrice] = useState(29);
  const [customers, setCustomers] = useState(500);
  const [churnRate, setChurnRate] = useState(4);
  const [growthRate, setGrowthRate] = useState(8);

  const [unitsSold, setUnitsSold] = useState(1000);
  const [unitPrice, setUnitPrice] = useState(49);
  const [refundRate, setRefundRate] = useState(5);

  const [monthlyVisitors, setMonthlyVisitors] = useState(100000);
  const [conversionRate, setConversionRate] = useState(2);
  const [averageOrderValue, setAverageOrderValue] = useState(35);

  const [months, setMonths] = useState(12);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (
      price < 0 ||
      customers < 0 ||
      churnRate < 0 ||
      churnRate > 100 ||
      growthRate < 0 ||
      unitsSold < 0 ||
      unitPrice < 0 ||
      refundRate < 0 ||
      refundRate > 100 ||
      monthlyVisitors < 0 ||
      conversionRate < 0 ||
      conversionRate > 100 ||
      averageOrderValue < 0 ||
      months <= 0
    ) {
      return null;
    }

    if (model === "subscription") {
      let activeCustomers = customers;
      let totalRevenue = 0;

      for (let month = 0; month < months; month++) {
        totalRevenue += activeCustomers * price;
        activeCustomers =
          activeCustomers * (1 - churnRate / 100) *
          (1 + growthRate / 100);
      }

      const monthlyRecurringRevenue = customers * price;
      const annualRecurringRevenue = monthlyRecurringRevenue * 12;

      return {
        monthlyRevenue: monthlyRecurringRevenue,
        annualRevenue: annualRecurringRevenue,
        periodRevenue: totalRevenue,
        customers: activeCustomers,
        orders: customers,
      };
    }

    if (model === "unit-sales") {
      const grossRevenue = unitsSold * unitPrice;
      const refundAmount = grossRevenue * (refundRate / 100);
      const netRevenue = grossRevenue - refundAmount;

      return {
        monthlyRevenue: netRevenue,
        annualRevenue: netRevenue * 12,
        periodRevenue: netRevenue * months,
        customers: unitsSold,
        orders: unitsSold,
      };
    }

    const orders = monthlyVisitors * (conversionRate / 100);
    const monthlyRevenue = orders * averageOrderValue;

    return {
      monthlyRevenue,
      annualRevenue: monthlyRevenue * 12,
      periodRevenue: monthlyRevenue * months,
      customers: orders,
      orders,
    };
  }, [
    model,
    price,
    customers,
    churnRate,
    growthRate,
    unitsSold,
    unitPrice,
    refundRate,
    monthlyVisitors,
    conversionRate,
    averageOrderValue,
    months,
  ]);

  function validateInputs() {
    if (
      price < 0 ||
      customers < 0 ||
      unitsSold < 0 ||
      unitPrice < 0 ||
      monthlyVisitors < 0 ||
      averageOrderValue < 0
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (
      churnRate < 0 ||
      churnRate > 100 ||
      refundRate < 0 ||
      refundRate > 100 ||
      conversionRate < 0 ||
      conversionRate > 100
    ) {
      setError("Percentage values must be between 0 and 100.");
      return false;
    }

    if (months <= 0) {
      setError("Time period must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setModel("subscription");
    setPrice(29);
    setCustomers(500);
    setChurnRate(4);
    setGrowthRate(8);
    setUnitsSold(1000);
    setUnitPrice(49);
    setRefundRate(5);
    setMonthlyVisitors(100000);
    setConversionRate(2);
    setAverageOrderValue(35);
    setMonths(12);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate revenue
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Estimate revenue for subscriptions, unit sales or traffic-based
          business models with growth, churn, refunds and conversions.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value as CurrencyCode)
              }
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

          <label className="block">
            <span className="text-sm font-bold text-black">Revenue model</span>

            <select
              value={model}
              onChange={(event) => setModel(event.target.value as RevenueModel)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="subscription">Subscription</option>
              <option value="unit-sales">Unit sales</option>
              <option value="traffic">Traffic / conversion</option>
            </select>
          </label>
        </div>

        {model === "subscription" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Monthly price" value={price} onChange={setPrice} onBlur={validateInputs} />
            <NumberInput label="Current customers" value={customers} onChange={setCustomers} onBlur={validateInputs} />
            <NumberInput label="Monthly churn %" value={churnRate} onChange={setChurnRate} onBlur={validateInputs} />
            <NumberInput label="Monthly growth %" value={growthRate} onChange={setGrowthRate} onBlur={validateInputs} />
          </div>
        )}

        {model === "unit-sales" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Units sold per month" value={unitsSold} onChange={setUnitsSold} onBlur={validateInputs} />
            <NumberInput label="Unit price" value={unitPrice} onChange={setUnitPrice} onBlur={validateInputs} />
            <NumberInput label="Refund rate %" value={refundRate} onChange={setRefundRate} onBlur={validateInputs} />
          </div>
        )}

        {model === "traffic" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Monthly visitors" value={monthlyVisitors} onChange={setMonthlyVisitors} onBlur={validateInputs} />
            <NumberInput label="Conversion rate %" value={conversionRate} onChange={setConversionRate} onBlur={validateInputs} />
            <NumberInput label="Average order value" value={averageOrderValue} onChange={setAverageOrderValue} onBlur={validateInputs} />
          </div>
        )}

        <NumberInput
          label="Forecast period months"
          value={months}
          onChange={setMonths}
          onBlur={validateInputs}
        />

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
        <ToolResultBox title="Revenue estimate">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Monthly revenue"
              value={formatCurrency(result.monthlyRevenue, currency)}
              highlight
            />

            <ResultCard
              label="Annual revenue"
              value={formatCurrency(result.annualRevenue, currency)}
            />

            <ResultCard
              label={`${months}-month revenue`}
              value={formatCurrency(result.periodRevenue, currency)}
            />

            <ResultCard
              label={model === "traffic" ? "Monthly orders" : "Volume"}
              value={formatNumber(result.orders)}
            />

            <ResultCard
              label={
                model === "subscription"
                  ? "Projected customers"
                  : "Revenue model"
              }
              value={
                model === "subscription"
                  ? formatNumber(result.customers)
                  : model
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Estimated monthly revenue is{" "}
            <strong className="text-black">
              {formatCurrency(result.monthlyRevenue, currency)}
            </strong>
            , with projected annual revenue of{" "}
            <strong className="text-black">
              {formatCurrency(result.annualRevenue, currency)}
            </strong>
            .
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid revenue assumptions to calculate projected revenue.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Revenue estimates depend heavily on pricing, churn, conversions, refunds
        and seasonality. Use this as a planning model, not a guarantee.
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