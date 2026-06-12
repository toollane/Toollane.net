"use client";

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function createSafeFileName(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${cleaned || "selected-pages"}.pdf`;
}

export default function PdfSplitterClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [outputName, setOutputName] = useState("selected-pages.pdf");
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = pdf.getPageCount();

      setFile(selectedFile);
      setPageCount(count);
      setSelectedPages(Array.from({ length: count }, (_, index) => index + 1));
      setOutputName(selectedFile.name.replace(/\.pdf$/i, "") || "selected-pages");
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
    if (selectedFile) void loadPdf(selectedFile);
  }

  function togglePage(pageNumber: number) {
    setSelectedPages((current) =>
      current.includes(pageNumber)
        ? current.filter((page) => page !== pageNumber)
        : [...current, pageNumber].sort((a, b) => a - b)
    );
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
    setOutputName("selected-pages.pdf");
    setError("");

    if (inputRef.current) inputRef.current.value = "";
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
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const pageIndexes = selectedPages.map((page) => page - 1);
      const copiedPages = await newPdf.copyPages(pdf, pageIndexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        selectedPages.length === 1
          ? `page-${selectedPages[0]}.pdf`
          : createSafeFileName(outputName);

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
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);

        newPdf.addPage(page);

        const pdfBytes = await newPdf.save();
        const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
        const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

        pdfUint8Array.set(pdfBytes);

        const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
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
          Upload a PDF, select pages and download them as a new PDF. You can
          also split every page into a separate PDF file directly in your browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Selected file" value={file ? "1 PDF" : "No file"} />
        <StatCard label="Pages" value={pageCount ? String(pageCount) : "-"} />
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
            if (event.target.files) handleFiles(event.target.files);
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
          Select one PDF file. Your document stays on your device and is not
          uploaded to a server.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          {reading ? "Reading PDF..." : "Choose PDF file"}
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file && pageCount ? (
        <ToolResultBox title="Selected PDF">
          <div className="grid gap-5">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>
              <div className="mt-1 text-xs text-black/50">
                {pageCount} pages · {formatFileSize(file.size)}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-black">
                Output file name for selected pages
              </span>

              <input
                type="text"
                value={outputName}
                onChange={(event) => setOutputName(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs leading-5 text-black/50">
                The extracted PDF will be saved as {createSafeFileName(outputName)}.
              </p>
            </label>

            <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-black">Select pages</h3>
                  <p className="mt-1 text-sm text-black/60">
                    {selectedPages.length} of {pageCount} pages selected.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={selectAllPages}
                    disabled={loading}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={clearPages}
                    disabled={loading}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {Array.from({ length: pageCount }, (_, index) => {
                  const pageNumber = index + 1;
                  const selected = selectedPages.includes(pageNumber);

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => togglePage(pageNumber)}
                      disabled={loading}
                      className={`rounded-xl border px-3 py-3 text-sm font-black transition disabled:opacity-40 ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black hover:border-black"
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
        <ToolInfoBox>
          Choose a PDF file to split it. After loading the file, select the pages
          you want to extract or split every page into a separate PDF.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={extractSelectedPages}
          disabled={!file || !selectedPages.length || loading || reading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Processing PDF..." : "Extract selected pages"}
        </button>

        <button
          type="button"
          onClick={splitIntoSinglePages}
          disabled={!file || !pageCount || loading || reading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Split every page
        </button>

        <button
          type="button"
          onClick={clearFile}
          disabled={!file || loading || reading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear file
        </button>
      </div>

      <ToolInfoBox>
        Splitting happens locally in your browser. For very large PDFs, splitting
        every page may trigger multiple downloads depending on your browser
        settings.
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