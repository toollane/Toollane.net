"use client";

import { useMemo, useState } from "react";

export default function InvoiceGeneratorClient() {
  const [fromName, setFromName] =
    useState("Your Company");

  const [toName, setToName] =
    useState("Client Name");

  const [invoiceNumber, setInvoiceNumber] =
    useState("INV-001");

  const [itemName, setItemName] =
    useState("Service");

  const [quantity, setQuantity] =
    useState("1");

  const [price, setPrice] =
    useState("100");

  const total = useMemo(() => {
    return (
      Number(quantity || 0) *
      Number(price || 0)
    ).toFixed(2);
  }, [quantity, price]);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3 print:hidden">
        <h2 className="text-2xl font-bold">
          Invoice Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create a simple invoice
          instantly and download it as
          a PDF using your browser.
        </p>
      </div>

      <div className="grid gap-4 print:hidden">
        <input
          value={fromName}
          onChange={(event) =>
            setFromName(event.target.value)
          }
          placeholder="Your company"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={toName}
          onChange={(event) =>
            setToName(event.target.value)
          }
          placeholder="Client name"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={invoiceNumber}
          onChange={(event) =>
            setInvoiceNumber(
              event.target.value
            )
          }
          placeholder="Invoice number"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <input
          value={itemName}
          onChange={(event) =>
            setItemName(event.target.value)
          }
          placeholder="Item or service"
          className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={quantity}
            onChange={(event) =>
              setQuantity(
                event.target.value
              )
            }
            type="number"
            min="0"
            placeholder="Quantity"
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />

          <input
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            type="number"
            min="0"
            placeholder="Price"
            className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
          />
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-6 print:border-0 print:rounded-none print:p-0">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold">
              Invoice
            </h3>

            <p className="text-black/60 mt-2">
              {invoiceNumber}
            </p>
          </div>

          <div className="text-right">
            <div className="font-semibold">
              {fromName}
            </div>

            <div className="text-black/60">
              Bill to: {toName}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-black/10 pt-6">
          <div className="grid grid-cols-4 gap-4 font-semibold text-sm">
            <div className="col-span-2">
              Item
            </div>

            <div>Qty</div>

            <div className="text-right">
              Price
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 py-4 border-b border-black/10 text-sm">
            <div className="col-span-2">
              {itemName}
            </div>

            <div>{quantity}</div>

            <div className="text-right">
              {Number(price || 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>{total}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={printInvoice}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold print:hidden"
      >
        Download / Print Invoice
      </button>
    </div>
  );
}