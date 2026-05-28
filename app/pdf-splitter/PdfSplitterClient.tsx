"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

export default function PdfSplitterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const splitPdf = async () => {
    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();

        const [page] = await newPdf.copyPages(pdf, [i]);

        newPdf.addPage(page);

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
        link.download = `page-${i + 1}.pdf`;
        link.click();

        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">PDF Splitter</h2>

        <p className="text-black/60 leading-7">
          Split PDF files into separate pages instantly in your browser.
        </p>
      </div>

      <input
        type="file"
        accept=".pdf"
        onChange={(event) => setFile(event.target.files?.[0] || null)}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={splitPdf}
        disabled={!file || loading}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading ? "Splitting PDF..." : "Split PDF"}
      </button>

      {file && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="font-semibold">Selected PDF</div>

          <div className="mt-2">{file.name}</div>
        </div>
      )}
    </div>
  );
}