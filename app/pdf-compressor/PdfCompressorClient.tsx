"use client";

import { useMemo, useRef, useState } from "react";
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

function createSafeFileName(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${cleaned || "compressed"}-compressed.pdf`;
}

export default function PdfCompressorClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [outputName, setOutputName] = useState("compressed.pdf");
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const savedBytes =
    originalSize !== null && compressedSize !== null
      ? originalSize - compressedSize
      : null;

  const savedPercent =
    originalSize !== null &&
    compressedSize !== null &&
    originalSize > 0
      ? Math.max(0, (savedBytes || 0) / originalSize) * 100
      : null;

  const compressionStatus = useMemo(() => {
    if (compressedSize === null || originalSize === null) {
      return "Not compressed yet";
    }

    if (compressedSize < originalSize) {
      return "Reduced size";
    }

    if (compressedSize === originalSize) {
      return "Same size";
    }

    return "Larger after optimization";
  }, [compressedSize, originalSize]);

  function revokeDownloadUrl() {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl("");
    }
  }

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    setCompressedSize(null);
    revokeDownloadUrl();

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
    setOutputName(selectedFile.name.replace(/\.pdf$/i, "") || "compressed");
  }

  function clearFile() {
    revokeDownloadUrl();
    setFile(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setOutputName("compressed.pdf");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function compressPdf() {
    setError("");
    setCompressedSize(null);
    revokeDownloadUrl();

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

      const url = URL.createObjectURL(blob);

      setCompressedSize(blob.size);
      setDownloadUrl(url);

      const link = document.createElement("a");

      link.href = url;
      link.download = createSafeFileName(outputName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError(
        "Something went wrong while compressing the PDF. Please make sure the file is a valid, unlocked PDF."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadAgain() {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = createSafeFileName(outputName);

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compress PDF online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF and optimize its file structure directly in your browser.
          Your file stays on your device and is not uploaded to a server.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Selected file"
          value={file ? "1 PDF" : "No file"}
        />
        <StatCard
          label="Original size"
          value={originalSize !== null ? formatFileSize(originalSize) : "-"}
        />
        <StatCard label="Privacy" value="Browser-based" />
      </div>

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-[2rem] border-2 border-dashed p-6 text-center transition sm:p-8 ${
          dragActive
            ? "border-black bg-white"
            : "border-black/15 bg-[#fff8df] hover:border-black/25"
        }`}
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
          Select one PDF file. Compression depends on how the PDF was created
          and whether images are already compressed.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose PDF file
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Output file name</span>

        <input
          type="text"
          value={outputName}
          onChange={(event) => {
            revokeDownloadUrl();
            setOutputName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          The file will be saved as {createSafeFileName(outputName)}.
        </p>
      </label>

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
              <div className="grid gap-3 sm:grid-cols-4">
                <ResultStat
                  label="Original"
                  value={formatFileSize(originalSize)}
                />

                <ResultStat
                  label="Compressed"
                  value={formatFileSize(compressedSize)}
                />

                <ResultStat
                  label="Saved"
                  value={
                    savedPercent !== null
                      ? `${savedPercent.toFixed(1)}%`
                      : "0%"
                  }
                />

                <ResultStat label="Status" value={compressionStatus} />
              </div>
            )}

            {compressedSize !== null &&
              originalSize !== null &&
              compressedSize >= originalSize && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
                  This PDF could not be reduced further with browser-based
                  structure optimization. It may already be compressed or may
                  contain images that need separate image recompression.
                </div>
              )}
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Choose a PDF file to compress it. This tool works best on PDFs that
          contain unused objects or unoptimized structure.
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

        {downloadUrl && (
          <button
            type="button"
            onClick={downloadAgain}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download again
          </button>
        )}

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
        Browser-based PDF compression can optimize PDF structure, but it may not
        strongly reduce image-heavy PDFs that already contain compressed images.
        For those files, compressing images before creating the PDF can produce
        larger savings.
      </ToolInfoBox>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-lg font-black text-black">{value}</div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-base font-black text-black">{value}</div>
    </div>
  );
}