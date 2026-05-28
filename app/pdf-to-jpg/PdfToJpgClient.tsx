"use client";

import { useState } from "react";

import JSZip from "jszip";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "/pdf.worker.min.mjs";

export default function PdfToJpgClient() {
  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const convertPdfToJpg =
    async () => {
      if (!file) {
        return;
      }

      setLoading(true);

      try {
        const bytes =
          await file.arrayBuffer();

        const pdf =
          await pdfjsLib.getDocument({
            data: bytes,
          }).promise;

        const zip = new JSZip();

        for (
          let pageNumber = 1;
          pageNumber <= pdf.numPages;
          pageNumber++
        ) {
          const page =
            await pdf.getPage(pageNumber);

          const viewport =
            page.getViewport({
              scale: 2,
            });

          const canvas =
            document.createElement("canvas");

          const context =
            canvas.getContext("2d");

          if (!context) {
            continue;
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvas,
            canvasContext: context,
            viewport,
          }).promise;

          const blob =
            await new Promise<Blob | null>(
              (resolve) =>
                canvas.toBlob(
                  resolve,

                  0.92
                )
            );

          if (blob) {
            zip.file(
              `page-${pageNumber}.jpg`,
              blob
            );
          }
        }

        const zipBlob =
          await zip.generateAsync({
            type: "blob",
          });

        const url =
          URL.createObjectURL(zipBlob);

        const link =
          document.createElement("a");

        link.href = url;
        link.download = "pdf-to-jpg.zip";
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
          PDF to JPG
        </h2>

        <p className="text-black/60 leading-7">
          Convert PDF pages into
          high-quality JPG images
          instantly in your browser.
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
        onClick={convertPdfToJpg}
        disabled={!file || loading}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        {loading
          ? "Converting PDF..."
          : "Convert to JPG"}
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