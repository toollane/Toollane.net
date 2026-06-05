"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";

type Item = {
  id: string;
  name: string;
  value: number;
};

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export default function NetWorthCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [error, setError] = useState("");

  const [assets, setAssets] = useState<Item[]>([
    { id: crypto.randomUUID(), name: "Cash & savings", value: 15000 },
    { id: crypto.randomUUID(), name: "Investments", value: 65000 },
    { id: crypto.randomUUID(), name: "Home equity", value: 120000 },
    { id: crypto.randomUUID(), name: "Vehicles", value: 18000 },
  ]);

  const [liabilities, setLiabilities] = useState<Item[]>([
    { id: crypto.randomUUID(), name: "Mortgage", value: 220000 },
    { id: crypto.randomUUID(), name: "Student loans", value: 12000 },
    { id: crypto.randomUUID(), name: "Credit cards", value: 3500 },
  ]);

  const result = useMemo(() => {
    const invalidAssets = assets.some((item) => item.value < 0 || !item.name.trim());
    const invalidLiabilities = liabilities.some(
      (item) => item.value < 0 || !item.name.trim()
    );

    if (invalidAssets || invalidLiabilities) {
      return null;
    }

    const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = liabilities.reduce(
      (sum, item) => sum + item.value,
      0
    );

    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      debtToAssetRatio:
        totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
      assetCount: assets.length,
      liabilityCount: liabilities.length,
    };
  }, [assets, liabilities]);

  function updateItem(
    type: "asset" | "liability",
    id: string,
    key: keyof Item,
    value: string | number
  ) {
    const setter = type === "asset" ? setAssets : setLiabilities;

    setter((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );

    setError("");
  }

  function addItem(type: "asset" | "liability") {
    const item = {
      id: crypto.randomUUID(),
      name: type === "asset" ? "New asset" : "New debt",
      value: 0,
    };

    if (type === "asset") {
      setAssets((current) => [...current, item]);
    } else {
      setLiabilities((current) => [...current, item]);
    }
  }

  function removeItem(type: "asset" | "liability", id: string) {
    if (type === "asset") {
      setAssets((current) => current.filter((item) => item.id !== id));
    } else {
      setLiabilities((current) => current.filter((item) => item.id !== id));
    }
  }

  function validateInputs() {
    if (
      assets.some((item) => item.value < 0) ||
      liabilities.some((item) => item.value < 0)
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (
      assets.some((item) => !item.name.trim()) ||
      liabilities.some((item) => !item.name.trim())
    ) {
      setError("Each item needs a name.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAssets([
      { id: crypto.randomUUID(), name: "Cash & savings", value: 15000 },
      { id: crypto.randomUUID(), name: "Investments", value: 65000 },
      { id: crypto.randomUUID(), name: "Home equity", value: 120000 },
      { id: crypto.randomUUID(), name: "Vehicles", value: 18000 },
    ]);
    setLiabilities([
      { id: crypto.randomUUID(), name: "Mortgage", value: 220000 },
      { id: crypto.randomUUID(), name: "Student loans", value: 12000 },
      { id: crypto.randomUUID(), name: "Credit cards", value: 3500 },
    ]);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate net worth
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Add your assets and liabilities to calculate total net worth, debt
          levels and financial position.
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

        <EditableSection
          title="Assets"
          type="asset"
          items={assets}
          currency={currency}
          onUpdate={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
          onBlur={validateInputs}
        />

        <EditableSection
          title="Liabilities"
          type="liability"
          items={liabilities}
          currency={currency}
          onUpdate={updateItem}
          onAdd={addItem}
          onRemove={removeItem}
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
        <ToolResultBox title="Net worth result">
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              label="Net worth"
              value={formatCurrency(result.netWorth, currency)}
              highlight
            />

            <ResultCard
              label="Total assets"
              value={formatCurrency(result.totalAssets, currency)}
            />

            <ResultCard
              label="Total liabilities"
              value={formatCurrency(result.totalLiabilities, currency)}
            />

            <ResultCard
              label="Debt-to-asset ratio"
              value={`${result.debtToAssetRatio.toFixed(2)}%`}
            />

            <ResultCard label="Asset items" value={String(result.assetCount)} />

            <ResultCard
              label="Liability items"
              value={String(result.liabilityCount)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-7 text-black/65">
            Your estimated net worth is{" "}
            <strong className="text-black">
              {formatCurrency(result.netWorth, currency)}
            </strong>
            . This equals total assets minus total liabilities.
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Enter valid asset and liability values to calculate net worth.
        </ToolInfoBox>
      )}

      <ToolInfoBox>
        Net worth is a snapshot of your financial position. For more accurate
        tracking, update asset values and debt balances regularly.
      </ToolInfoBox>
    </div>
  );
}

function EditableSection({
  title,
  type,
  items,
  currency,
  onUpdate,
  onAdd,
  onRemove,
  onBlur,
}: {
  title: string;
  type: "asset" | "liability";
  items: Item[];
  currency: CurrencyCode;
  onUpdate: (
    type: "asset" | "liability",
    id: string,
    key: keyof Item,
    value: string | number
  ) => void;
  onAdd: (type: "asset" | "liability") => void;
  onRemove: (type: "asset" | "liability", id: string) => void;
  onBlur: () => void;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-black">{title}</h3>
          <p className="mt-1 text-sm text-black/50">
            Total: {formatCurrency(total, currency)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(type)}
          className="rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          Add {type}
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[1fr_180px_auto]"
          >
            <input
              value={item.name}
              onChange={(event) =>
                onUpdate(type, item.id, "name", event.target.value)
              }
              onBlur={onBlur}
              className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
            />

            <input
              type="number"
              value={item.value}
              onChange={(event) =>
                onUpdate(type, item.id, "value", Number(event.target.value))
              }
              onBlur={onBlur}
              className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(type, item.id)}
                className="rounded-xl border border-black/10 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-black/5"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
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