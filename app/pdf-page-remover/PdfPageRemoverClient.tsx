"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

export default function PdfPageRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);

  const removePages = async () => {
    if (!file || !pages.trim()) {
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const removeIndices = pages
        .split(",")
        .map((page) => Number(page.trim()) - 1)
        .filter((page) => page >= 0 && page < pdf.getPageCount());

      const keepPages = pdf
        .getPageIndices()
        .filter((index) => !removeIndices.includes(index));

      if (!keepPages.length) {
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, keepPages);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "edited-document.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">PDF Page Remover</h2>

        <p className="text-black/60 leading-7">
          Remove unwanted pages from PDF files instantly in your browser.
        </p>
      </div>

      <input
        type="file"
        accept=".pdf"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={pages}
        onChange={(event) => setPages(event.target.value)}
        placeholder="Pages to remove (example: 2,4,6)"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={removePages}
        disabled={!file || !pages.trim() || loading}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading ? "Removing Pages..." : "Remove Pages"}
      </button>

      {file && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="font-semibold mb-2">Selected PDF</div>

          <div>{file.name}</div>
        </div>
      )}
    </div>
  );
}