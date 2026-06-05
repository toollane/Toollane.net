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

function parsePageRanges(input: string, pageCount: number) {
  const pages = new Set<number>();
  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error("Invalid page range.");
      }

      if (start < 1 || end > pageCount || start > end) {
        throw new Error("Page range is outside the PDF page count.");
      }

      for (let page = start; page <= end; page++) {
        pages.add(page);
      }
    } else {
      const page = Number(part);

      if (!Number.isInteger(page) || page < 1 || page > pageCount) {
        throw new Error("Invalid page number.");
      }

      pages.add(page);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default function PdfPageExtractorClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  async function loadPdf(selectedFile: File) {
    setError("");
    setReading(true);
    setPageCount(null);
    setSelectedPages([]);
    setPageRange("1");

    try {
      const isPdf =
        selectedFile.type === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        setError("Please select a valid PDF file.");
        setFile(null);
        return;
      }

      const bytes = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const count = pdf.getPageCount();

      setFile(selectedFile);
      setPageCount(count);
      setSelectedPages([1]);
    } catch {
      setError(
        "Could not read this PDF file. Please make sure it is a valid, unlocked PDF."
      );
      setFile(null);
    } finally {
      setReading(false);
    }
  }

  function handleFiles(selectedFiles: FileList | File[]) {
    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) {
      return;
    }

    void loadPdf(selectedFile);
  }

  function updatePageRange(value: string) {
    setPageRange(value);
    setError("");

    if (!pageCount) {
      setSelectedPages([]);
      return;
    }

    try {
      const pages = parsePageRanges(value, pageCount);
      setSelectedPages(pages);
    } catch {
      setSelectedPages([]);
    }
  }

  function selectPreset(value: string) {
    updatePageRange(value);
  }

  function clearFile() {
    setFile(null);
    setPageCount(null);
    setSelectedPages([]);
    setPageRange("1");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function extractPages() {
    setError("");

    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    let pagesToExtract: number[];

    try {
      pagesToExtract = parsePageRanges(pageRange, pageCount);
    } catch {
      setError(
        `Please enter valid pages between 1 and ${pageCount}. Example: 1,3,5-7`
      );
      return;
    }

    if (!pagesToExtract.length) {
      setError("Please enter at least one page to extract.");
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const newPdf = await PDFDocument.create();
      const pageIndexes = pagesToExtract.map((page) => page - 1);
      const copiedPages = await newPdf.copyPages(pdf, pageIndexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      const cleanName = file.name.replace(/\.pdf$/i, "");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${cleanName}-extracted-pages.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Something went wrong while extracting pages. Please make sure the PDF is valid and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Extract pages from PDF
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF, enter the pages you want to keep and download a new PDF
          with only those pages. Everything runs directly in your browser.
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
          Select one PDF file. Your file stays private in your browser.
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

      {reading && (
        <ToolInfoBox>Reading PDF file and detecting page count...</ToolInfoBox>
      )}

      {file && pageCount ? (
        <ToolResultBox title="Selected PDF">
          <div className="grid gap-5">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>

              <div className="mt-1 text-xs text-black/50">
                {formatFileSize(file.size)} · {pageCount} pages
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-black">
                Pages to extract
              </label>

              <input
                value={pageRange}
                onChange={(event) => updatePageRange(event.target.value)}
                placeholder="Example: 1,3,5-7"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs leading-5 text-black/50">
                Use commas and ranges. Example: 1,3,5-7.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => selectPreset("1")}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                First page
              </button>

              <button
                type="button"
                onClick={() => selectPreset(String(pageCount))}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                Last page
              </button>

              <button
                type="button"
                onClick={() => selectPreset(`1-${pageCount}`)}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40"
              >
                All pages
              </button>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Pages selected
              </div>

              <div className="mt-2 text-lg font-black text-black">
                {selectedPages.length || 0}
              </div>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        !reading && (
          <ToolInfoBox>
            Upload a PDF to choose specific pages and create a new extracted PDF
            file.
          </ToolInfoBox>
        )
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={extractPages}
          disabled={!file || !selectedPages.length || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Extracting pages..." : "Extract pages"}
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
    </div>
  );
}