"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

export default function PdfMergerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const mergePdfs = async () => {
    if (!files.length) {
      return;
    }

    setLoading(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) =>
          mergedPdf.addPage(page)
        );
      }

      const mergedBytes =
        await mergedPdf.save();

   const pdfArrayBuffer = new ArrayBuffer(mergedBytes.length);
const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

pdfUint8Array.set(mergedBytes);

const blob = new Blob([pdfArrayBuffer], {
  type: "application/pdf",
});

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "merged.pdf";
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
          PDF Merger
        </h2>

        <p className="text-black/60 leading-7">
          Merge multiple PDF files
          into a single PDF instantly
          in your browser.
        </p>
      </div>

      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(event) =>
          setFiles(
            Array.from(
              event.target.files || []
            )
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={mergePdfs}
        disabled={
          !files.length || loading
        }
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Merging PDFs..."
          : "Merge PDFs"}
      </button>

      {files.length > 0 && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="font-semibold mb-3">
            Selected PDFs
          </div>

          <div className="grid gap-2">
            {files.map((file) => (
              <div key={file.name}>
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}