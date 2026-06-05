"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfCompressorClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    setCompressedSize(null);

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) {
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
  }

  function clearFile() {
    setFile(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function compressPdf() {
    setError("");
    setCompressedSize(null);

    if (!file) {
      setError("Please select a PDF file first.");
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
        addDefaultPage: false,
      });

      const pdfArrayBuffer = new ArrayBuffer(compressedBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(compressedBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      setCompressedSize(blob.size);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const cleanName = file.name.replace(/\.pdf$/i, "");

      link.href = url;
      link.download = `${cleanName}-compressed.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Something went wrong while compressing the PDF. Please make sure the file is a valid, unlocked PDF."
      );
    } finally {
      setLoading(false);
    }
  }

  const savedBytes =
    originalSize && compressedSize ? originalSize - compressedSize : null;

  const savedPercent =
    originalSize && compressedSize && originalSize > 0
      ? Math.max(0, (savedBytes || 0) / originalSize) * 100
      : null;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compress PDF online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF and reduce its file size directly in your browser. This
          tool optimizes PDF structure without uploading your file.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          PDF
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop a PDF file here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Select one PDF file. Your file stays in your browser and is not
          uploaded.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose PDF file
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file ? (
        <ToolResultBox title="Selected PDF">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>

              <div className="mt-1 text-xs text-black/50">
                Original size: {formatFileSize(file.size)}
              </div>
            </div>

            {compressedSize !== null && originalSize !== null && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Original
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {formatFileSize(originalSize)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Compressed
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {formatFileSize(compressedSize)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                    Saved
                  </div>
                  <div className="mt-2 text-lg font-black text-black">
                    {savedPercent !== null
                      ? `${savedPercent.toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Choose a PDF file to compress it. Compression results depend on how
          the PDF was created and whether it already contains optimized images.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={compressPdf}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Compressing PDF..." : "Compress PDF"}
        </button>

        <button
          type="button"
          onClick={clearFile}
          disabled={!file || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear file
        </button>
      </div>

      <ToolInfoBox>
        Note: Browser-based PDF compression can optimize PDF structure, but it
        may not strongly reduce files that already contain compressed images.
        Image-heavy PDFs may need image recompression for larger reductions.
      </ToolInfoBox>
    </div>
  );
}