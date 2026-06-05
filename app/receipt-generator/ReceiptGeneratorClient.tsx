"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ReceiptItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "$" },
  { code: "AUD", symbol: "$" },
];

function formatMoney(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReceiptGeneratorClient() {
  const [storeName, setStoreName] = useState("Toollane Store");
  const [storeDetails, setStoreDetails] = useState(
    "123 Business Street\nCity, Country\nsupport@example.com"
  );
  const [receiptNumber, setReceiptNumber] = useState("RCPT-2026-001");
  const [date, setDate] = useState("2026-06-03");
  const [time, setTime] = useState("14:30");
  const [cashier, setCashier] = useState("Alex");
  const [currencyCode, setCurrencyCode] = useState("EUR");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [taxRate, setTaxRate] = useState(19);
  const [tip, setTip] = useState(0);
  const [notes, setNotes] = useState("Thank you for your purchase!");

  const [items, setItems] = useState<ReceiptItem[]>([
    {
      id: crypto.randomUUID(),
      name: "Coffee",
      quantity: 2,
      price: 3.5,
    },
    {
      id: crypto.randomUUID(),
      name: "Sandwich",
      quantity: 1,
      price: 7.9,
    },
  ]);

  const [error, setError] = useState("");

  const currency =
    CURRENCIES.find((item) => item.code === currencyCode) || CURRENCIES[1];

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const tax = subtotal * (Math.max(taxRate, 0) / 100);
    const total = subtotal + tax + Math.max(tip, 0);

    return {
      subtotal,
      tax,
      tip: Math.max(tip, 0),
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items, taxRate, tip]);

  function updateItem(id: string, field: keyof ReceiptItem, value: string | number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "name" ? String(value) : Number(value),
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "New item",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function validateReceipt() {
    if (!storeName.trim()) {
      setError("Store name is required.");
      return false;
    }

    if (!receiptNumber.trim()) {
      setError("Receipt number is required.");
      return false;
    }

    if (!items.length) {
      setError("Add at least one receipt item.");
      return false;
    }

    if (items.some((item) => !item.name.trim() || item.quantity <= 0 || item.price < 0)) {
      setError("Every item needs a name, quantity greater than zero and non-negative price.");
      return false;
    }

    setError("");
    return true;
  }

  function printReceipt() {
    if (!validateReceipt()) return;
    window.print();
  }

  async function copyReceipt() {
    if (!validateReceipt()) return;

    const lines = [
      storeName,
      storeDetails,
      "",
      `Receipt: ${receiptNumber}`,
      `Date: ${date} ${time}`,
      `Cashier: ${cashier}`,
      `Payment: ${paymentMethod}`,
      "",
      ...items.map(
        (item) =>
          `${item.quantity} × ${item.name} — ${formatMoney(
            item.quantity * item.price,
            currency.symbol
          )}`
      ),
      "",
      `Subtotal: ${formatMoney(totals.subtotal, currency.symbol)}`,
      `Tax (${taxRate}%): ${formatMoney(totals.tax, currency.symbol)}`,
      `Tip / Service: ${formatMoney(totals.tip, currency.symbol)}`,
      `Total: ${formatMoney(totals.total, currency.symbol)}`,
      "",
      notes,
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
  }

  function resetExample() {
    setStoreName("Toollane Store");
    setStoreDetails("123 Business Street\nCity, Country\nsupport@example.com");
    setReceiptNumber("RCPT-2026-001");
    setDate("2026-06-03");
    setTime("14:30");
    setCashier("Alex");
    setCurrencyCode("EUR");
    setPaymentMethod("Card");
    setTaxRate(19);
    setTip(0);
    setNotes("Thank you for your purchase!");
    setItems([
      {
        id: crypto.randomUUID(),
        name: "Coffee",
        quantity: 2,
        price: 3.5,
      },
      {
        id: crypto.randomUUID(),
        name: "Sandwich",
        quantity: 1,
        price: 7.9,
      },
    ]);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Receipt Generator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Create printable receipts for sales, services, orders and small
          business transactions with taxes, tips, payment method and itemized
          totals.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 print:hidden">
        <h2 className="text-lg font-black text-black">
          Fast receipt creation
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Add itemized products or services</li>
          <li>• Calculate tax, tip and total automatically</li>
          <li>• Mobile-friendly editing and receipt preview</li>
          <li>• Print or save as PDF from your browser</li>
        </ul>
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-6 print:hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Store / business name" value={storeName} onChange={setStoreName} />
          <Input label="Receipt number" value={receiptNumber} onChange={setReceiptNumber} />
          <Textarea label="Store details" value={storeDetails} onChange={setStoreDetails} />
          <Textarea label="Notes / footer" value={notes} onChange={setNotes} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input label="Date" value={date} onChange={setDate} type="date" />
          <Input label="Time" value={time} onChange={setTime} type="time" />
          <Input label="Cashier" value={cashier} onChange={setCashier} />
          <Input label="Payment method" value={paymentMethod} onChange={setPaymentMethod} />

          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currencyCode}
              onChange={(event) => setCurrencyCode(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ToolResultBox title="Receipt items">
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-[2rem] border border-black/10 bg-white p-4 sm:grid-cols-[1fr_110px_130px_auto]"
              >
                <input
                  value={item.name}
                  onChange={(event) => updateItem(item.id, "name", event.target.value)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Item name"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Qty"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(event) => updateItem(item.id, "price", event.target.value)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Price"
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-5 rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Add item
          </button>
        </ToolResultBox>

        <div className="grid gap-4 sm:grid-cols-3">
          <InputNumber label="Tax rate %" value={taxRate} onChange={setTaxRate} />
          <InputNumber label="Tip / service amount" value={tip} onChange={setTip} />

          <div className="rounded-2xl border border-black bg-black p-5 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-white/50">
              Total
            </div>
            <div className="mt-2 text-2xl font-black">
              {formatMoney(totals.total, currency.symbol)}
            </div>
          </div>
        </div>
      </div>

      <ToolResultBox title="Receipt preview">
        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-black/10 bg-white p-6 font-mono text-sm text-black print:border-0 print:p-0">
          <div className="text-center">
            <div className="text-xl font-black uppercase">{storeName}</div>
            <div className="mt-3 whitespace-pre-line text-xs leading-5 text-black/60">
              {storeDetails}
            </div>
          </div>

          <div className="my-6 border-t border-dashed border-black/20" />

          <div className="grid gap-1 text-xs">
            <div className="flex justify-between">
              <span>Receipt</span>
              <span>{receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>
                {date} {time}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cashier</span>
              <span>{cashier}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span>{paymentMethod}</span>
            </div>
          </div>

          <div className="my-6 border-t border-dashed border-black/20" />

          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between gap-4">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-bold">
                    {formatMoney(item.quantity * item.price, currency.symbol)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-black/50">
                  {item.quantity} × {formatMoney(item.price, currency.symbol)}
                </div>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-dashed border-black/20" />

          <div className="grid gap-2">
            <SummaryRow label="Items" value={totals.itemCount.toString()} />
            <SummaryRow label="Subtotal" value={formatMoney(totals.subtotal, currency.symbol)} />
            <SummaryRow label={`Tax (${taxRate}%)`} value={formatMoney(totals.tax, currency.symbol)} />
            <SummaryRow label="Tip / service" value={formatMoney(totals.tip, currency.symbol)} />

            <div className="mt-3 flex justify-between border-t border-dashed border-black/20 pt-4 text-lg font-black">
              <span>TOTAL</span>
              <span>{formatMoney(totals.total, currency.symbol)}</span>
            </div>
          </div>

          {notes && (
            <>
              <div className="my-6 border-t border-dashed border-black/20" />
              <div className="whitespace-pre-line text-center text-xs leading-5 text-black/60">
                {notes}
              </div>
            </>
          )}
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={printReceipt}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Print / Save PDF
        </button>

        <button
          type="button"
          onClick={copyReceipt}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy receipt
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset example
        </button>
      </div>

      <ToolInfoBox>
        This receipt generator is useful for small businesses, sellers,
        freelancers, service providers, market stalls and simple order
        confirmations.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function InputNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-[120px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}