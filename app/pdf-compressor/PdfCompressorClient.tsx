"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

export default function PdfCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const compressPdf = async () => {
    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
      });

      const pdfArrayBuffer =
        new ArrayBuffer(compressedBytes.length);

      const pdfUint8Array =
        new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(compressedBytes);

      const blob = new Blob(
        [pdfArrayBuffer],
        {
          type: "application/pdf",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "compressed.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          PDF Compressor
        </h2>

        <p className="text-black/60 leading-7">
          Compress a PDF file instantly
          in your browser and reduce
          the file size without uploading
          it.
        </p>
      </div>

      <input
        type="file"
        accept=".pdf"
        onChange={(event) =>
          setFile(
            event.target.files?.[0] ||
              null
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={compressPdf}
        disabled={!file || loading}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Compressing PDF..."
          : "Compress PDF"}
      </button>

      {file && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="font-semibold mb-3">
            Selected PDF
          </div>

          <div>{file.name}</div>
        </div>
      )}
    </div>
  );
}