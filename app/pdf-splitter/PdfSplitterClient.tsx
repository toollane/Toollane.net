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

export default function PdfSplitterClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  async function loadPdf(selectedFile: File) {
    setError("");
    setReading(true);
    setPageCount(null);
    setSelectedPages([]);

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
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();

      setFile(selectedFile);
      setPageCount(count);
      setSelectedPages(Array.from({ length: count }, (_, index) => index + 1));
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

  function togglePage(pageNumber: number) {
    setSelectedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter((page) => page !== pageNumber);
      }

      return [...current, pageNumber].sort((a, b) => a - b);
    });
  }

  function selectAllPages() {
    if (!pageCount) return;

    setSelectedPages(Array.from({ length: pageCount }, (_, index) => index + 1));
  }

  function clearPages() {
    setSelectedPages([]);
  }

  function clearFile() {
    setFile(null);
    setPageCount(null);
    setSelectedPages([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function extractSelectedPages() {
    setError("");

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    if (!selectedPages.length) {
      setError("Please select at least one page to extract.");
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const pageIndexes = selectedPages.map((page) => page - 1);
      const copiedPages = await newPdf.copyPages(pdf, pageIndexes);

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
      link.download =
        selectedPages.length === 1
          ? `page-${selectedPages[0]}.pdf`
          : "selected-pages.pdf";

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

  async function splitIntoSinglePages() {
    setError("");

    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      for (let i = 0; i < pageCount; i++) {
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

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
      }
    } catch {
      setError(
        "Something went wrong while splitting the PDF. Please make sure the PDF is valid and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Split PDF files online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF, select the pages you want and download them as a new PDF.
          You can also split every page into separate PDF files.
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

      {reading && (
        <ToolInfoBox>
          Reading PDF file and detecting pages...
        </ToolInfoBox>
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
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-bold text-black">
                  Select pages to extract
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllPages}
                    disabled={loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={clearPages}
                    disabled={loading}
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {Array.from({ length: pageCount }, (_, index) => {
                  const pageNumber = index + 1;
                  const active = selectedPages.includes(pageNumber);

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => togglePage(pageNumber)}
                      disabled={loading}
                      className={`rounded-xl border px-3 py-3 text-sm font-bold transition disabled:opacity-40 ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black hover:bg-black/5"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        !reading && (
          <ToolInfoBox>
            Upload a PDF to select pages or split every page into separate files.
          </ToolInfoBox>
        )
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={extractSelectedPages}
          disabled={!file || !selectedPages.length || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Processing PDF..." : "Extract selected pages"}
        </button>

        <button
          type="button"
          onClick={splitIntoSinglePages}
          disabled={!file || !pageCount || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Split into single pages
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