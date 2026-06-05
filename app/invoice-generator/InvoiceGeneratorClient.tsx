"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type DiscountType = "fixed" | "percent";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "CAD", symbol: "$", label: "CAD — Canadian Dollar" },
  { code: "AUD", symbol: "$", label: "AUD — Australian Dollar" },
  { code: "CHF", symbol: "CHF ", label: "CHF — Swiss Franc" },
];

function formatMoney(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function InvoiceGeneratorClient() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState("2026-06-03");
  const [dueDate, setDueDate] = useState("2026-06-17");
  const [currencyCode, setCurrencyCode] = useState("EUR");

  const [businessName, setBusinessName] = useState("Your Business");
  const [businessDetails, setBusinessDetails] = useState(
    "Street Address\nCity, Country\nhello@example.com"
  );

  const [clientName, setClientName] = useState("Client Company");
  const [clientDetails, setClientDetails] = useState(
    "Client Street\nClient City, Country\nclient@example.com"
  );

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      description: "Website design package",
      quantity: 1,
      price: 1200,
    },
    {
      id: crypto.randomUUID(),
      description: "SEO setup",
      quantity: 1,
      price: 350,
    },
  ]);

  const [taxRate, setTaxRate] = useState(19);
  const [discountType, setDiscountType] = useState<DiscountType>("fixed");
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState(
    "Thank you for your business. Payment is due by the date above."
  );
  const [paymentTerms, setPaymentTerms] = useState(
    "Bank transfer, card payment or PayPal accepted."
  );
  const [error, setError] = useState("");

  const currency = CURRENCIES.find((item) => item.code === currencyCode) || CURRENCIES[1];

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const discount =
      discountType === "percent"
        ? subtotal * (Math.min(Math.max(discountValue, 0), 100) / 100)
        : Math.max(discountValue, 0);

    const taxableAmount = Math.max(subtotal - discount, 0);
    const tax = taxableAmount * (Math.max(taxRate, 0) / 100);
    const total = taxableAmount + tax;

    return {
      subtotal,
      discount,
      taxableAmount,
      tax,
      total,
    };
  }, [items, discountType, discountValue, taxRate]);

  function updateItem(id: string, field: keyof InvoiceItem, value: string | number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "description" ? String(value) : Number(value),
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
        description: "New item",
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function validateInvoice() {
    if (!businessName.trim()) {
      setError("Business name is required.");
      return false;
    }

    if (!clientName.trim()) {
      setError("Client name is required.");
      return false;
    }

    if (!items.length) {
      setError("Add at least one invoice item.");
      return false;
    }

    if (items.some((item) => item.quantity <= 0 || item.price < 0)) {
      setError("Item quantities must be greater than zero and prices cannot be negative.");
      return false;
    }

    setError("");
    return true;
  }

  function printInvoice() {
    if (!validateInvoice()) return;
    window.print();
  }

  async function copySummary() {
    if (!validateInvoice()) return;

    const summary = [
      `Invoice ${invoiceNumber}`,
      `From: ${businessName}`,
      `To: ${clientName}`,
      `Date: ${invoiceDate}`,
      `Due: ${dueDate}`,
      "",
      ...items.map(
        (item) =>
          `${item.description} — ${item.quantity} × ${formatMoney(item.price, currency.symbol)} = ${formatMoney(
            item.quantity * item.price,
            currency.symbol
          )}`
      ),
      "",
      `Subtotal: ${formatMoney(totals.subtotal, currency.symbol)}`,
      `Discount: ${formatMoney(totals.discount, currency.symbol)}`,
      `Tax: ${formatMoney(totals.tax, currency.symbol)}`,
      `Total: ${formatMoney(totals.total, currency.symbol)}`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
  }

  function resetExample() {
    setInvoiceNumber("INV-2026-001");
    setInvoiceDate("2026-06-03");
    setDueDate("2026-06-17");
    setCurrencyCode("EUR");
    setBusinessName("Your Business");
    setBusinessDetails("Street Address\nCity, Country\nhello@example.com");
    setClientName("Client Company");
    setClientDetails("Client Street\nClient City, Country\nclient@example.com");
    setItems([
      {
        id: crypto.randomUUID(),
        description: "Website design package",
        quantity: 1,
        price: 1200,
      },
      {
        id: crypto.randomUUID(),
        description: "SEO setup",
        quantity: 1,
        price: 350,
      },
    ]);
    setTaxRate(19);
    setDiscountType("fixed");
    setDiscountValue(0);
    setNotes("Thank you for your business. Payment is due by the date above.");
    setPaymentTerms("Bank transfer, card payment or PayPal accepted.");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Invoice Generator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Create professional invoices with line items, tax, discounts, due
          dates, client details and print-ready invoice preview.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6 print:hidden">
        <h2 className="text-lg font-black text-black">
          Professional invoice workflow
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Add unlimited invoice line items</li>
          <li>• Supports tax, discounts and multiple currencies</li>
          <li>• Mobile-friendly editing and print-ready layout</li>
          <li>• Use browser print to save as PDF</li>
        </ul>
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-6 print:hidden">
        <div className="grid gap-4 sm:grid-cols-4">
          <Input label="Invoice number" value={invoiceNumber} onChange={setInvoiceNumber} />
          <Input label="Invoice date" value={invoiceDate} onChange={setInvoiceDate} type="date" />
          <Input label="Due date" value={dueDate} onChange={setDueDate} type="date" />

          <label className="block">
            <span className="text-sm font-bold text-black">Currency</span>

            <select
              value={currencyCode}
              onChange={(event) => setCurrencyCode(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              {CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Business name" value={businessName} onChange={setBusinessName} />
          <Input label="Client name" value={clientName} onChange={setClientName} />

          <Textarea label="Business details" value={businessDetails} onChange={setBusinessDetails} />
          <Textarea label="Client details" value={clientDetails} onChange={setClientDetails} />
        </div>

        <ToolResultBox title="Invoice items">
          <div className="grid gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-[2rem] border border-black/10 bg-white p-4 sm:grid-cols-[1fr_120px_140px_auto]"
              >
                <input
                  value={item.description}
                  onChange={(event) => updateItem(item.id, "description", event.target.value)}
                  className="rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black"
                  placeholder="Description"
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

        <div className="grid gap-4 sm:grid-cols-4">
          <InputNumber label="Tax rate %" value={taxRate} onChange={setTaxRate} />

          <label className="block">
            <span className="text-sm font-bold text-black">Discount type</span>

            <select
              value={discountType}
              onChange={(event) => setDiscountType(event.target.value as DiscountType)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="fixed">Fixed amount</option>
              <option value="percent">Percentage</option>
            </select>
          </label>

          <InputNumber label="Discount" value={discountValue} onChange={setDiscountValue} />
          <div className="rounded-2xl border border-black bg-black p-5 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-white/50">
              Total
            </div>
            <div className="mt-2 text-2xl font-black">
              {formatMoney(totals.total, currency.symbol)}
            </div>
          </div>
        </div>

        <Textarea label="Payment terms" value={paymentTerms} onChange={setPaymentTerms} />
        <Textarea label="Notes" value={notes} onChange={setNotes} />
      </div>

      <ToolResultBox title="Invoice preview">
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 text-black print:border-0 print:p-0">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div>
              <div className="text-3xl font-black">INVOICE</div>
              <div className="mt-2 text-sm text-black/60">{invoiceNumber}</div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-black">{businessName}</div>
              <div className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                {businessDetails}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Bill to
              </div>
              <div className="mt-2 font-black">{clientName}</div>
              <div className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                {clientDetails}
              </div>
            </div>

            <div className="grid gap-2 text-sm sm:text-right">
              <div>
                <strong>Invoice date:</strong> {invoiceDate}
              </div>
              <div>
                <strong>Due date:</strong> {dueDate}
              </div>
              <div>
                <strong>Currency:</strong> {currencyCode}
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 pr-4 text-right">Qty</th>
                  <th className="py-3 pr-4 text-right">Price</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-black/5">
                    <td className="py-4 pr-4">{item.description}</td>
                    <td className="py-4 pr-4 text-right">{item.quantity}</td>
                    <td className="py-4 pr-4 text-right">
                      {formatMoney(item.price, currency.symbol)}
                    </td>
                    <td className="py-4 text-right font-bold">
                      {formatMoney(item.quantity * item.price, currency.symbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm space-y-3 text-sm">
              <SummaryRow label="Subtotal" value={formatMoney(totals.subtotal, currency.symbol)} />
              <SummaryRow label="Discount" value={`-${formatMoney(totals.discount, currency.symbol)}`} />
              <SummaryRow label={`Tax (${taxRate}%)`} value={formatMoney(totals.tax, currency.symbol)} />

              <div className="flex justify-between border-t border-black/10 pt-4 text-xl font-black">
                <span>Total</span>
                <span>{formatMoney(totals.total, currency.symbol)}</span>
              </div>
            </div>
          </div>

          {(paymentTerms || notes) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {paymentTerms && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Payment terms
                  </div>
                  <div className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                    {paymentTerms}
                  </div>
                </div>
              )}

              {notes && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Notes
                  </div>
                  <div className="mt-2 whitespace-pre-line text-sm leading-6 text-black/60">
                    {notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={printInvoice}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Print / Save PDF
        </button>

        <button
          type="button"
          onClick={copySummary}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy summary
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
        For best PDF export, use the browser print dialog and choose “Save as
        PDF”. This invoice generator is suitable for freelancers, agencies,
        consultants, creators and small businesses.
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
        className="mt-3 min-h-[130px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition focus:border-black"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-black/60">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}