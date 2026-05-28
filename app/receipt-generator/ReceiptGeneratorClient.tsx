"use client";

import { useState } from "react";

import jsPDF from "jspdf";

export default function ReceiptGeneratorClient() {
  const [store, setStore] =
    useState("");

  const [item, setItem] =
    useState("");

  const [price, setPrice] =
    useState("");

  const generateReceipt = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(24);

    pdf.text(

      20,
      30
    );

    pdf.setFontSize(14);

    pdf.text(
      `Store: ${store}`,
      20,
      60
    );

    pdf.text(
      `Item: ${item}`,
      20,
      80
    );

    pdf.text(
      `Price: $${price}`,
      20,
      100
    );

    pdf.text(
      `Date: ${new Date().toLocaleDateString()}`,
      20,
      120
    );

    pdf.save("receipt.pdf");
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Receipt Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create printable receipts
          instantly for businesses,
          freelancers and shops.
        </p>
      </div>

      <input
        value={store}
        onChange={(event) =>
          setStore(
            event.target.value
          )
        }
        placeholder="Store Name"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={item}
        onChange={(event) =>
          setItem(
            event.target.value
          )
        }
        placeholder="Purchased Item"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={price}
        onChange={(event) =>
          setPrice(
            event.target.value
          )
        }
        placeholder="Price"
        type="number"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={generateReceipt}
        disabled={
          !store ||
          !item ||
          !price
        }
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Generate Receipt PDF
      </button>
    </div>
  );
}