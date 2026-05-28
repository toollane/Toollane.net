"use client";

import { useState } from "react";

import { PDFDocument } from "pdf-lib";

export default function ScreenshotToPdfClient() {
  const [files, setFiles] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const convertToPdf = async () => {
    if (!files.length) {
      return;
    }

    setLoading(true);

    try {
      const pdf =
        await PDFDocument.create();

      for (const file of files) {
        const bytes =
          await file.arrayBuffer();

        let image;

        if (file.type === "image/png") {
          image =
            await pdf.embedPng(bytes);
        } else {
          image =
            await pdf.embedJpg(bytes);
        }

        const page =
          pdf.addPage([
            image.width,
            image.height,
          ]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes =
        await pdf.save();

      const pdfArrayBuffer =
        new ArrayBuffer(pdfBytes.length);

      const pdfUint8Array =
        new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

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
      link.download =
        "screenshots-to-pdf.pdf";

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
          Screenshot to PDF
        </h2>

        <p className="text-black/60 leading-7">
          Convert screenshots and
          images into a PDF instantly
          in your browser.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg"
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
        onClick={convertToPdf}
        disabled={
          !files.length || loading
        }
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Creating PDF..."
          : "Convert to PDF"}
      </button>

      {files.length > 0 && (
        <div className="bg-white border border-black/10 rounded-3xl p-6">
          <div className="font-semibold mb-3">
            Selected Screenshots
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