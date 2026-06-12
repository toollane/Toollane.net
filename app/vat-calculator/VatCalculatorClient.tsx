"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type VatMode = "add" | "remove";

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function calculateVat({
  amount,
  vatRate,
  discountPercent,
  quantity,
  mode,
}: {
  amount: number;
  vatRate: number;
  discountPercent: number;
  quantity: number;
  mode: VatMode;
}) {
  if (
    amount < 0 ||
    vatRate < 0 ||
    vatRate > 100 ||
    discountPercent < 0 ||
    discountPercent > 100 ||
    quantity <= 0
  ) {
    return null;
  }

  const discountedUnitAmount = amount * (1 - discountPercent / 100);
  const lineAmount = discountedUnitAmount * quantity;
  const vatMultiplier = 1 + vatRate / 100;

  if (mode === "add") {
    const vatAmount = lineAmount * (vatRate / 100);
    const grossAmount = lineAmount + vatAmount;

    return {
      netAmount: lineAmount,
      vatAmount,
      grossAmount,
      unitNet: discountedUnitAmount,
      unitGross: discountedUnitAmount * vatMultiplier,
      originalLineAmount: amount * quantity,
      discountAmount: amount * quantity - lineAmount,
      vatShareOfGross: grossAmount > 0 ? (vatAmount / grossAmount) * 100 : 0,
      effectiveRate: lineAmount > 0 ? (vatAmount / lineAmount) * 100 : 0,
    };
  }

  const netAmount = lineAmount / vatMultiplier;
  const vatAmount = lineAmount - netAmount;

  return {
    netAmount,
    vatAmount,
    grossAmount: lineAmount,
    unitNet: netAmount / quantity,
    unitGross: discountedUnitAmount,
    originalLineAmount: amount * quantity,
    discountAmount: amount * quantity - lineAmount,
    vatShareOfGross: lineAmount > 0 ? (vatAmount / lineAmount) * 100 : 0,
    effectiveRate: netAmount > 0 ? (vatAmount / netAmount) * 100 : 0,
  };
}

export default function VatCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [mode, setMode] = useState<VatMode>("add");
  const [amount, setAmount] = useState("100");
  const [vatRate, setVatRate] = useState("19");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      amount: parseNumber(amount),
      vatRate: parseNumber(vatRate),
      discountPercent: parseNumber(discountPercent),
      quantity: parseNumber(quantity),
    }),
    [amount, vatRate, discountPercent, quantity]
  );

  const result = useMemo(
    () =>
      calculateVat({
        amount: numericValues.amount,
        vatRate: numericValues.vatRate,
        discountPercent: numericValues.discountPercent,
        quantity: numericValues.quantity,
        mode,
      }),
    [numericValues, mode]
  );

  function validateInputs() {
    if (numericValues.amount < 0) {
      setError("Amount cannot be negative.");
      return false;
    }

    if (
      numericValues.vatRate < 0 ||
      numericValues.vatRate > 100 ||
      numericValues.discountPercent < 0 ||
      numericValues.discountPercent > 100
    ) {
      setError("VAT and discount percentages must be between 0 and 100.");
      return false;
    }

    if (numericValues.quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("EUR");
    setMode("add");
    setAmount("100");
    setVatRate("19");
    setDiscountPercent("0");
    setQuantity("1");
    setShowDetails(false);
    setError("");
  }

  function applyPreset(nextCurrency: CurrencyCode, nextRate: string) {
    setCurrency(nextCurrency);
    setVatRate(nextRate);
    setShowDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate VAT online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Add VAT to a net price or remove VAT from a gross price with support
          for quantity, discounts, VAT rates and multiple currencies.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Net amount"
          value={result ? formatCurrency(result.netAmount, currency) : "—"}
        />
        <StatCard
          label="VAT amount"
          value={result ? formatCurrency(result.vatAmount, currency) : "—"}
        />
        <StatCard
          label="Gross amount"
          value={result ? formatCurrency(result.grossAmount, currency) : "—"}
        />
      </div>

      <ToolResultBox title="VAT details">
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
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-black">VAT mode</span>

            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as VatMode);
                setShowDetails(false);
                setError("");
              }}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="add">Add VAT to net amount</option>
              <option value="remove">Remove VAT from gross amount</option>
            </select>
          </label>

          <TextNumberInput
            label={mode === "add" ? "Net amount" : "Gross amount"}
            value={amount}
            onChange={setAmount}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="VAT rate"
            value={vatRate}
            onChange={setVatRate}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Discount"
            value={discountPercent}
            onChange={setDiscountPercent}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            onBlur={validateInputs}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => applyPreset("EUR", "19")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Germany 19%
          </button>

          <button
            type="button"
            onClick={() => applyPreset("GBP", "20")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            UK 20%
          </button>

          <button
            type="button"
            onClick={() => applyPreset("EUR", "20")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            France 20%
          </button>

          <button
            type="button"
            onClick={() => applyPreset("EUR", "21")}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Spain 21%
          </button>

          <button
            type="button"
            onClick={resetExample}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Reset example
          </button>
        </div>
      </ToolResultBox>

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <>
          <ToolResultBox title="VAT result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ResultCard
                label="Gross amount"
                value={formatCurrency(result.grossAmount, currency)}
                highlight
              />

              <ResultCard
                label="Net amount"
                value={formatCurrency(result.netAmount, currency)}
              />

              <ResultCard
                label="VAT amount"
                value={formatCurrency(result.vatAmount, currency)}
              />

              <ResultCard
                label="Unit gross"
                value={formatCurrency(result.unitGross, currency)}
              />

              <ResultCard
                label="Unit net"
                value={formatCurrency(result.unitNet, currency)}
              />

              <ResultCard
                label="VAT share"
                value={formatPercent(result.vatShareOfGross)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              {mode === "add" ? "Adding" : "Removing"} VAT at{" "}
              <strong className="text-black">
                {formatPercent(numericValues.vatRate)}
              </strong>{" "}
              gives a VAT amount of{" "}
              <strong className="text-black">
                {formatCurrency(result.vatAmount, currency)}
              </strong>{" "}
              and a gross total of{" "}
              <strong className="text-black">
                {formatCurrency(result.grossAmount, currency)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="VAT breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Net amount"
                percentage={
                  result.grossAmount > 0
                    ? (result.netAmount / result.grossAmount) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.netAmount, currency)}
              />

              <BreakdownBar
                label="VAT amount"
                percentage={result.vatShareOfGross}
                formattedValue={formatCurrency(result.vatAmount, currency)}
              />

              <BreakdownBar
                label="Discount"
                percentage={
                  result.originalLineAmount > 0
                    ? (result.discountAmount / result.originalLineAmount) * 100
                    : 0
                }
                formattedValue={formatCurrency(result.discountAmount, currency)}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Formula and calculation details"
            description="Show how the VAT result is calculated for add VAT and remove VAT mode."
            open={showDetails}
            onToggle={() => setShowDetails((current) => !current)}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-sm font-black text-black">Add VAT</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  VAT amount = Net amount × VAT rate. Gross amount = Net amount
                  + VAT amount.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-sm font-black text-black">Remove VAT</h3>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  Net amount = Gross amount ÷ (1 + VAT rate). VAT amount =
                  Gross amount - Net amount.
                </p>
              </div>

              <ResultCard
                label="Original line amount"
                value={formatCurrency(result.originalLineAmount, currency)}
              />

              <ResultCard
                label="Discount amount"
                value={formatCurrency(result.discountAmount, currency)}
              />

              <ResultCard
                label="Effective VAT rate"
                value={formatPercent(result.effectiveRate)}
              />
            </div>
          </TogglePanel>
        </>
      ) : (
        <ToolInfoBox>
          Enter valid VAT values to calculate net and gross amounts.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        This VAT calculator provides estimates only. VAT rates and rules can vary
        by country, product type, customer location, exemptions, reverse charge
        rules and tax registration status.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        {prefix && (
          <div className="flex items-center border-r border-black/10 px-4 text-sm font-bold text-black/50">
            {prefix}
          </div>
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-black">{value}</div>
    </div>
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

function BreakdownBar({
  label,
  percentage,
  formattedValue,
}: {
  label: string;
  percentage: number;
  formattedValue: string;
}) {
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{label}</div>

          <div className="mt-1 text-xs text-black/50">
            {formatPercent(percentage)} of gross amount
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formattedValue}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}

function TogglePanel({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-black">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-black/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-black/5"
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>

      {open && <div className="mt-5">{children}</div>}
    </div>
  );
}