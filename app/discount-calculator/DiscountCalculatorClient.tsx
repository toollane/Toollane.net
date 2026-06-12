"use client";

import { useMemo, useState, type ReactNode } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

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

function calculateDiscount({
  originalPrice,
  discountPercent,
  additionalDiscountPercent,
  taxPercent,
  shippingCost,
  quantity,
}: {
  originalPrice: number;
  discountPercent: number;
  additionalDiscountPercent: number;
  taxPercent: number;
  shippingCost: number;
  quantity: number;
}) {
  if (
    originalPrice < 0 ||
    discountPercent < 0 ||
    discountPercent > 100 ||
    additionalDiscountPercent < 0 ||
    additionalDiscountPercent > 100 ||
    taxPercent < 0 ||
    taxPercent > 100 ||
    shippingCost < 0 ||
    quantity <= 0
  ) {
    return null;
  }

  const firstDiscount = originalPrice * (discountPercent / 100);
  const priceAfterFirstDiscount = originalPrice - firstDiscount;
  const secondDiscount =
    priceAfterFirstDiscount * (additionalDiscountPercent / 100);
  const finalUnitPrice = priceAfterFirstDiscount - secondDiscount;

  const originalSubtotal = originalPrice * quantity;
  const discountedSubtotal = finalUnitPrice * quantity;
  const taxAmount = discountedSubtotal * (taxPercent / 100);
  const finalTotal = discountedSubtotal + taxAmount + shippingCost;
  const totalSaved = originalSubtotal - discountedSubtotal;
  const totalDiscountAmount = firstDiscount * quantity + secondDiscount * quantity;
  const effectiveDiscount =
    originalPrice > 0
      ? ((originalPrice - finalUnitPrice) / originalPrice) * 100
      : 0;

  return {
    firstDiscount,
    secondDiscount,
    finalUnitPrice,
    originalSubtotal,
    discountedSubtotal,
    taxAmount,
    finalTotal,
    totalSaved,
    totalDiscountAmount,
    effectiveDiscount,
    savingsRate:
      originalSubtotal > 0 ? (totalSaved / originalSubtotal) * 100 : 0,
    taxShare: finalTotal > 0 ? (taxAmount / finalTotal) * 100 : 0,
    shippingShare: finalTotal > 0 ? (shippingCost / finalTotal) * 100 : 0,
  };
}

export default function DiscountCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [originalPrice, setOriginalPrice] = useState("120");
  const [discountPercent, setDiscountPercent] = useState("25");
  const [additionalDiscountPercent, setAdditionalDiscountPercent] =
    useState("10");
  const [taxPercent, setTaxPercent] = useState("8");
  const [shippingCost, setShippingCost] = useState("5");
  const [quantity, setQuantity] = useState("2");
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");

  const numericValues = useMemo(
    () => ({
      originalPrice: parseNumber(originalPrice),
      discountPercent: parseNumber(discountPercent),
      additionalDiscountPercent: parseNumber(additionalDiscountPercent),
      taxPercent: parseNumber(taxPercent),
      shippingCost: parseNumber(shippingCost),
      quantity: parseNumber(quantity),
    }),
    [
      originalPrice,
      discountPercent,
      additionalDiscountPercent,
      taxPercent,
      shippingCost,
      quantity,
    ]
  );

  const result = useMemo(
    () =>
      calculateDiscount({
        originalPrice: numericValues.originalPrice,
        discountPercent: numericValues.discountPercent,
        additionalDiscountPercent: numericValues.additionalDiscountPercent,
        taxPercent: numericValues.taxPercent,
        shippingCost: numericValues.shippingCost,
        quantity: numericValues.quantity,
      }),
    [numericValues]
  );

  function validateInputs() {
    if (numericValues.originalPrice < 0 || numericValues.shippingCost < 0) {
      setError("Price and shipping cannot be negative.");
      return false;
    }

    if (numericValues.quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return false;
    }

    if (
      numericValues.discountPercent < 0 ||
      numericValues.discountPercent > 100 ||
      numericValues.additionalDiscountPercent < 0 ||
      numericValues.additionalDiscountPercent > 100 ||
      numericValues.taxPercent < 0 ||
      numericValues.taxPercent > 100
    ) {
      setError("Percentage values must be between 0 and 100.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setOriginalPrice("120");
    setDiscountPercent("25");
    setAdditionalDiscountPercent("10");
    setTaxPercent("8");
    setShippingCost("5");
    setQuantity("2");
    setShowDetails(false);
    setError("");
  }

  function applyScenario({
    price,
    discount,
    extraDiscount,
    tax,
    shipping,
    items,
  }: {
    price: string;
    discount: string;
    extraDiscount: string;
    tax: string;
    shipping: string;
    items: string;
  }) {
    setOriginalPrice(price);
    setDiscountPercent(discount);
    setAdditionalDiscountPercent(extraDiscount);
    setTaxPercent(tax);
    setShippingCost(shipping);
    setQuantity(items);
    setShowDetails(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate discount price online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Calculate final price after discounts, stacked discounts, tax,
          shipping and quantity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Final total"
          value={result ? formatCurrency(result.finalTotal, currency) : "—"}
        />
        <StatCard
          label="Total saved"
          value={result ? formatCurrency(result.totalSaved, currency) : "—"}
        />
        <StatCard
          label="Effective discount"
          value={result ? formatPercent(result.effectiveDiscount) : "0%"}
        />
      </div>

      <ToolResultBox title="Discount details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
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

          <TextNumberInput
            label="Original unit price"
            value={originalPrice}
            onChange={setOriginalPrice}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
          />

          <TextNumberInput
            label="Discount"
            value={discountPercent}
            onChange={setDiscountPercent}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Additional discount"
            value={additionalDiscountPercent}
            onChange={setAdditionalDiscountPercent}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Tax / VAT"
            value={taxPercent}
            onChange={setTaxPercent}
            onBlur={validateInputs}
            suffix="%"
          />

          <TextNumberInput
            label="Shipping cost"
            value={shippingCost}
            onChange={setShippingCost}
            onBlur={validateInputs}
            prefix={currencySymbols[currency]}
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
            onClick={() =>
              applyScenario({
                price: "120",
                discount: "25",
                extraDiscount: "10",
                tax: "8",
                shipping: "5",
                items: "2",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Stacked sale
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                price: "80",
                discount: "20",
                extraDiscount: "0",
                tax: "0",
                shipping: "0",
                items: "1",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Simple discount
          </button>

          <button
            type="button"
            onClick={() =>
              applyScenario({
                price: "49.99",
                discount: "15",
                extraDiscount: "5",
                tax: "7.5",
                shipping: "4.99",
                items: "3",
              })
            }
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
          >
            Shopping cart
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
          <ToolResultBox title="Discount result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Final total"
                value={formatCurrency(result.finalTotal, currency)}
                highlight
              />

              <ResultCard
                label="Final unit price"
                value={formatCurrency(result.finalUnitPrice, currency)}
              />

              <ResultCard
                label="Subtotal after discount"
                value={formatCurrency(result.discountedSubtotal, currency)}
              />

              <ResultCard
                label="Total saved"
                value={formatCurrency(result.totalSaved, currency)}
              />

              <ResultCard
                label="Original subtotal"
                value={formatCurrency(result.originalSubtotal, currency)}
              />

              <ResultCard
                label="Effective discount"
                value={formatPercent(result.effectiveDiscount)}
              />

              <ResultCard
                label="Tax amount"
                value={formatCurrency(result.taxAmount, currency)}
              />

              <ResultCard
                label="Shipping"
                value={formatCurrency(numericValues.shippingCost, currency)}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Your final total is{" "}
              <strong className="text-black">
                {formatCurrency(result.finalTotal, currency)}
              </strong>
              . You save{" "}
              <strong className="text-black">
                {formatCurrency(result.totalSaved, currency)}
              </strong>{" "}
              before tax and shipping, with an effective discount of{" "}
              <strong className="text-black">
                {formatPercent(result.effectiveDiscount)}
              </strong>
              .
            </div>
          </ToolResultBox>

          <ToolResultBox title="Price breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownBar
                label="Discounted subtotal"
                percentage={
                  result.finalTotal > 0
                    ? (result.discountedSubtotal / result.finalTotal) * 100
                    : 0
                }
                formattedValue={formatCurrency(
                  result.discountedSubtotal,
                  currency
                )}
              />

              <BreakdownBar
                label="Tax"
                percentage={result.taxShare}
                formattedValue={formatCurrency(result.taxAmount, currency)}
              />

              <BreakdownBar
                label="Shipping"
                percentage={result.shippingShare}
                formattedValue={formatCurrency(
                  numericValues.shippingCost,
                  currency
                )}
              />
            </div>
          </ToolResultBox>

          <TogglePanel
            title="Discount calculation details"
            description="Show stacked discount amounts, savings rate and calculation details."
            open={showDetails}
            onToggle={() => setShowDetails((current) => !current)}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ResultCard
                label="First discount"
                value={formatCurrency(result.firstDiscount, currency)}
              />

              <ResultCard
                label="Additional discount"
                value={formatCurrency(result.secondDiscount, currency)}
              />

              <ResultCard
                label="Total discount amount"
                value={formatCurrency(result.totalDiscountAmount, currency)}
              />

              <ResultCard
                label="Savings rate"
                value={formatPercent(result.savingsRate)}
              />

              <ResultCard
                label="Quantity"
                value={String(numericValues.quantity)}
              />

              <ResultCard
                label="Formula"
                value="Price × Discounts + Tax + Shipping"
              />
            </div>
          </TogglePanel>
        </>
      ) : (
        <ToolInfoBox>Enter valid price and discount values.</ToolInfoBox>
      )}

      <ToolInfoBox>
        This discount calculator provides estimates only. Final prices may vary
        due to taxes, shipping rules, coupons, exclusions, rounding, currency
        conversion and store policies.
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
            {formatPercent(percentage)} of final total
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
  children: ReactNode;
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