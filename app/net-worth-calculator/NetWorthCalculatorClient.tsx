"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
type ItemType = "asset" | "liability";

type ItemInput = {
  id: string;
  name: string;
  value: string;
};

type ParsedItem = {
  id: string;
  name: string;
  value: number;
};

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
};

const defaultAssets: ItemInput[] = [
  { id: "asset-1", name: "Cash & savings", value: "15000" },
  { id: "asset-2", name: "Investments", value: "65000" },
  { id: "asset-3", name: "Home equity", value: "120000" },
  { id: "asset-4", name: "Vehicles", value: "18000" },
];

const defaultLiabilities: ItemInput[] = [
  { id: "liability-1", name: "Mortgage", value: "220000" },
  { id: "liability-2", name: "Student loans", value: "12000" },
  { id: "liability-3", name: "Credit cards", value: "3500" },
];

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

function parseItems(items: ItemInput[]): ParsedItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    value: parseNumber(item.value),
  }));
}

function findLargestItem(items: ParsedItem[]) {
  const validItems = items.filter((item) => item.value > 0);

  if (!validItems.length) return null;

  return validItems.reduce((largest, item) =>
    item.value > largest.value ? item : largest
  );
}

export default function NetWorthCalculatorClient() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [assets, setAssets] = useState<ItemInput[]>(defaultAssets);
  const [liabilities, setLiabilities] =
    useState<ItemInput[]>(defaultLiabilities);
  const [error, setError] = useState("");

  const parsedAssets = useMemo(() => parseItems(assets), [assets]);
  const parsedLiabilities = useMemo(
    () => parseItems(liabilities),
    [liabilities]
  );

  const result = useMemo(() => {
    const invalidAssets = parsedAssets.some(
      (item) => item.value < 0 || !item.name.trim()
    );

    const invalidLiabilities = parsedLiabilities.some(
      (item) => item.value < 0 || !item.name.trim()
    );

    if (invalidAssets || invalidLiabilities) {
      return null;
    }

    const totalAssets = parsedAssets.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = parsedLiabilities.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio =
      totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const equityRatio = totalAssets > 0 ? (netWorth / totalAssets) * 100 : 0;
    const assetCoverageRatio =
      totalLiabilities > 0 ? totalAssets / totalLiabilities : null;
    const largestAsset = findLargestItem(parsedAssets);
    const largestLiability = findLargestItem(parsedLiabilities);

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      debtToAssetRatio,
      equityRatio,
      assetCoverageRatio,
      assetCount: parsedAssets.length,
      liabilityCount: parsedLiabilities.length,
      largestAsset,
      largestLiability,
    };
  }, [parsedAssets, parsedLiabilities]);

  function updateItem(
    type: ItemType,
    id: string,
    key: "name" | "value",
    value: string
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

  function addItem(type: ItemType) {
    const item: ItemInput = {
      id: `${type}-${Date.now()}`,
      name: type === "asset" ? "New asset" : "New debt",
      value: "0",
    };

    if (type === "asset") {
      setAssets((current) => [...current, item]);
    } else {
      setLiabilities((current) => [...current, item]);
    }

    setError("");
  }

  function removeItem(type: ItemType, id: string) {
    if (type === "asset") {
      setAssets((current) => current.filter((item) => item.id !== id));
    } else {
      setLiabilities((current) => current.filter((item) => item.id !== id));
    }

    setError("");
  }

  function validateInputs() {
    if (
      parsedAssets.some((item) => item.value < 0) ||
      parsedLiabilities.some((item) => item.value < 0)
    ) {
      setError("Values cannot be negative.");
      return false;
    }

    if (
      parsedAssets.some((item) => !item.name.trim()) ||
      parsedLiabilities.some((item) => !item.name.trim())
    ) {
      setError("Each asset and liability needs a name.");
      return false;
    }

    setError("");
    return true;
  }

  function resetExample() {
    setCurrency("USD");
    setAssets(defaultAssets.map((item) => ({ ...item })));
    setLiabilities(defaultLiabilities.map((item) => ({ ...item })));
    setError("");
  }

  function applyScenario(
    nextAssets: ItemInput[],
    nextLiabilities: ItemInput[],
    nextCurrency: CurrencyCode = currency
  ) {
    setCurrency(nextCurrency);
    setAssets(nextAssets.map((item) => ({ ...item })));
    setLiabilities(nextLiabilities.map((item) => ({ ...item })));
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Calculate your net worth online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Add assets and liabilities to calculate net worth, debt-to-asset
          ratio, equity ratio and your overall financial position.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total assets"
          value={formatCurrency(result?.totalAssets ?? 0, currency)}
        />

        <StatCard
          label="Total liabilities"
          value={formatCurrency(result?.totalLiabilities ?? 0, currency)}
        />

        <StatCard
          label="Net worth"
          value={formatCurrency(result?.netWorth ?? 0, currency)}
        />
      </div>

      <ToolResultBox title="Net worth details">
        <div className="grid gap-4">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                applyScenario(defaultAssets, defaultLiabilities, "USD")
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
            >
              Household example
            </button>

            <button
              type="button"
              onClick={() =>
                applyScenario(
                  [
                    { id: "asset-1", name: "Cash", value: "8000" },
                    { id: "asset-2", name: "Investments", value: "18000" },
                    { id: "asset-3", name: "Car", value: "9000" },
                  ],
                  [
                    { id: "liability-1", name: "Credit cards", value: "2500" },
                    { id: "liability-2", name: "Car loan", value: "7000" },
                  ],
                  "USD"
                )
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
            >
              Early career
            </button>

            <button
              type="button"
              onClick={() =>
                applyScenario(
                  [
                    { id: "asset-1", name: "Cash", value: "25000" },
                    { id: "asset-2", name: "Investments", value: "320000" },
                    { id: "asset-3", name: "Home equity", value: "280000" },
                    { id: "asset-4", name: "Retirement accounts", value: "410000" },
                  ],
                  [
                    { id: "liability-1", name: "Mortgage", value: "180000" },
                    { id: "liability-2", name: "Credit cards", value: "0" },
                  ],
                  "USD"
                )
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
            >
              Long-term saver
            </button>

            <button
              type="button"
              onClick={resetExample}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs font-bold text-black transition hover:bg-black/5"
            >
              Reset example
            </button>
          </div>
        </div>
      </ToolResultBox>

      <EditableSection
        title="Assets"
        description="Add cash, investments, property, vehicles, business value and other assets."
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
        description="Add mortgages, loans, credit cards, taxes owed and other debts."
        type="liability"
        items={liabilities}
        currency={currency}
        onUpdate={updateItem}
        onAdd={addItem}
        onRemove={removeItem}
        onBlur={validateInputs}
      />

      {error && <ToolErrorBox message={error} />}

      {result ? (
        <>
          <ToolResultBox title="Net worth result">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                value={formatPercent(result.debtToAssetRatio)}
              />

              <ResultCard
                label="Equity ratio"
                value={formatPercent(result.equityRatio)}
              />

              <ResultCard
                label="Asset coverage"
                value={
                  result.assetCoverageRatio === null
                    ? "No liabilities"
                    : `${result.assetCoverageRatio.toFixed(2)}x`
                }
              />

              <ResultCard
                label="Largest asset"
                value={result.largestAsset ? result.largestAsset.name : "None"}
              />

              <ResultCard
                label="Largest liability"
                value={
                  result.largestLiability ? result.largestLiability.name : "None"
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              Your estimated net worth is{" "}
              <strong className="text-black">
                {formatCurrency(result.netWorth, currency)}
              </strong>
              . This equals total assets minus total liabilities.
            </div>
          </ToolResultBox>

          <ToolResultBox title="Asset breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              {parsedAssets.map((item) => (
                <BreakdownCard
                  key={item.id}
                  item={item}
                  total={result.totalAssets}
                  currency={currency}
                />
              ))}
            </div>
          </ToolResultBox>

          <ToolResultBox title="Liability breakdown">
            <div className="grid gap-4 sm:grid-cols-2">
              {parsedLiabilities.map((item) => (
                <BreakdownCard
                  key={item.id}
                  item={item}
                  total={result.totalLiabilities}
                  currency={currency}
                />
              ))}
            </div>
          </ToolResultBox>
        </>
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
  description,
  type,
  items,
  currency,
  onUpdate,
  onAdd,
  onRemove,
  onBlur,
}: {
  title: string;
  description: string;
  type: ItemType;
  items: ItemInput[];
  currency: CurrencyCode;
  onUpdate: (
    type: ItemType,
    id: string,
    key: "name" | "value",
    value: string
  ) => void;
  onAdd: (type: ItemType) => void;
  onRemove: (type: ItemType, id: string) => void;
  onBlur: () => void;
}) {
  const total = items.reduce((sum, item) => sum + parseNumber(item.value), 0);

  return (
    <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black text-black">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-black/50">{description}</p>

          <p className="mt-2 text-sm font-bold text-black">
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
            className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 sm:grid-cols-[1fr_220px_auto]"
          >
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-black/40">
                Name
              </span>

              <input
                value={item.name}
                onChange={(event) =>
                  onUpdate(type, item.id, "name", event.target.value)
                }
                onBlur={onBlur}
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-black/40">
                Value
              </span>

              <div className="mt-2 flex overflow-hidden rounded-xl border border-black/10 bg-white transition focus-within:border-black">
                <div className="flex items-center border-r border-black/10 px-3 text-sm font-bold text-black/50">
                  {currencySymbols[currency]}
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  value={item.value}
                  onChange={(event) =>
                    onUpdate(type, item.id, "value", event.target.value)
                  }
                  onBlur={onBlur}
                  className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                />
              </div>
            </label>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(type, item.id)}
                className="rounded-xl border border-black/10 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-black/5 sm:self-end"
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

function BreakdownCard({
  item,
  total,
  currency,
}: {
  item: ParsedItem;
  total: number;
  currency: CurrencyCode;
}) {
  const percentage = total > 0 ? (item.value / total) * 100 : 0;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-black text-black">{item.name}</div>

          <div className="mt-1 text-xs text-black/50">
            {formatPercent(percentage)} of total
          </div>
        </div>

        <div className="text-right text-sm font-black text-black">
          {formatCurrency(item.value, currency)}
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
}