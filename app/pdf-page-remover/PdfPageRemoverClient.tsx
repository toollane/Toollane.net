"use client";

import { useEffect, useRef, useState } from "react";
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
  const pages: number[] = [];
  const seen = new Set<number>();

  const parts = input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  function addPage(page: number) {
    if (!seen.has(page)) {
      pages.push(page);
      seen.add(page);
    }
  }

  for (const part of parts) {
    if (part.includes("-")) {
      const rangeParts = part.split("-").map((value) => value.trim());

      if (rangeParts.length !== 2) {
        throw new Error("Invalid page range.");
      }

      const start = Number(rangeParts[0]);
      const end = Number(rangeParts[1]);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error("Invalid page range.");
      }

      if (start < 1 || end > pageCount || start > end) {
        throw new Error("Page range is outside the PDF page count.");
      }

      for (let page = start; page <= end; page += 1) {
        addPage(page);
      }
    } else {
      const page = Number(part);

      if (!Number.isInteger(page) || page < 1 || page > pageCount) {
        throw new Error("Invalid page number.");
      }

      addPage(page);
    }
  }

  return pages;
}

function getOddPages(pageCount: number) {
  return Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (page) => page % 2 === 1
  );
}

function getEvenPages(pageCount: number) {
  return Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (page) => page % 2 === 0
  );
}

function formatPagesAsRange(pages: number[]) {
  return pages.join(",");
}

function formatPagePreview(pages: number[]) {
  if (!pages.length) {
    return "No valid pages selected";
  }

  if (pages.length <= 10) {
    return pages.join(", ");
  }

  return `${pages.slice(0, 10).join(", ")} + ${pages.length - 10} more`;
}

function createDownloadName(fileName: string, pageRange: string) {
  const cleanName = fileName.replace(/\.pdf$/i, "");
  const cleanRange = pageRange
    .replace(/\s+/g, "")
    .replace(/[^0-9,-]/g, "")
    .slice(0, 40);

  return `${cleanName}-removed-${cleanRange || "pages"}.pdf`;
}

export default function PdfPageRemoverClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  async function loadPdf(selectedFile: File) {
    setError("");
    setReading(true);
    setPageCount(null);
    setSelectedPages([]);
    setPageRange("1");
    setDownloadUrl("");
    setDownloadName("");
    setOutputSize(null);

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
      setSelectedPages(count > 1 ? [1] : []);
      setPageRange("1");
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
    setDownloadUrl("");
    setDownloadName("");
    setOutputSize(null);

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
    setDownloadUrl("");
    setDownloadName("");
    setOutputSize(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function triggerDownload(url: string, name: string) {
    const link = document.createElement("a");

    link.href = url;
    link.download = name;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function removeSelectedPages() {
    setError("");

    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    let pagesToRemove: number[];

    try {
      pagesToRemove = parsePageRanges(pageRange, pageCount);
    } catch {
      setError(
        `Please enter valid pages between 1 and ${pageCount}. Example: 2,4,6-8`
      );
      return;
    }

    if (!pagesToRemove.length) {
      setError("Please enter at least one page to remove.");
      return;
    }

    if (pagesToRemove.length >= pageCount) {
      setError("You cannot remove all pages. At least one page must remain.");
      return;
    }

    setLoading(true);
    setDownloadUrl("");
    setDownloadName("");
    setOutputSize(null);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const removeSet = new Set(pagesToRemove);
      const keepPageIndexes = pdf
        .getPageIndices()
        .filter((index) => !removeSet.has(index + 1));

      if (!keepPageIndexes.length) {
        setError("You cannot remove all pages. At least one page must remain.");
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, keepPageIndexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const name = createDownloadName(file.name, pageRange);

      setDownloadUrl(url);
      setDownloadName(name);
      setOutputSize(blob.size);

      triggerDownload(url, name);
    } catch {
      setError(
        "Something went wrong while removing pages. Please make sure the PDF is valid and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const pagesRemaining =
    pageCount && selectedPages.length ? pageCount - selectedPages.length : 0;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Remove pages from PDF
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF, enter the pages you want to delete and download a new
          PDF with those pages removed. Everything runs directly in your browser.
        </p>
      </div>

      <div
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
            ? "border-black bg-[#fff3bd]"
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
          Select one PDF file. Your file stays private in your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={reading || loading}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {reading ? "Reading PDF..." : "Choose PDF file"}
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {reading && (
        <ToolInfoBox>Reading PDF file and detecting page count...</ToolInfoBox>
      )}

      {file && pageCount ? (
        <>
          <ToolResultBox title="Selected PDF">
            <div className="grid gap-5">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="truncate font-bold text-black">{file.name}</div>

                <div className="mt-1 text-xs text-black/50">
                  {formatFileSize(file.size)} · {pageCount} pages
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total pages" value={String(pageCount)} />

                <StatCard
                  label="Pages to remove"
                  value={String(selectedPages.length)}
                  highlight={selectedPages.length > 0}
                />

                <StatCard
                  label="Pages remaining"
                  value={
                    selectedPages.length > 0
                      ? String(pagesRemaining)
                      : String(pageCount)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-bold text-black">
                  Pages to remove
                </label>

                <input
                  value={pageRange}
                  onChange={(event) => updatePageRange(event.target.value)}
                  placeholder="Example: 2,4,6-8"
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                />

                <p className="mt-2 text-xs leading-5 text-black/50">
                  Use commas and ranges. Example: 2,4,6-8. Duplicate pages are
                  ignored.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Removal preview
                </div>

                <div className="mt-2 text-sm font-bold leading-6 text-black">
                  {formatPagePreview(selectedPages)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectPreset("1")}
                  disabled={loading || pageCount <= 1}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove first page
                </button>

                <button
                  type="button"
                  onClick={() => selectPreset(String(pageCount))}
                  disabled={loading || pageCount <= 1}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove last page
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectPreset(formatPagesAsRange(getOddPages(pageCount)))
                  }
                  disabled={loading || getOddPages(pageCount).length >= pageCount}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove odd pages
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectPreset(formatPagesAsRange(getEvenPages(pageCount)))
                  }
                  disabled={loading || pageCount < 2}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove even pages
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectPreset(
                      `1-${Math.max(1, Math.ceil(pageCount / 2))}`
                    )
                  }
                  disabled={loading || pageCount <= 1}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove first half
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectPreset(
                      `${Math.max(1, Math.ceil(pageCount / 2) + 1)}-${pageCount}`
                    )
                  }
                  disabled={loading || pageCount < 2}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
                >
                  Remove second half
                </button>
              </div>
            </div>
          </ToolResultBox>

          {downloadUrl && outputSize !== null && (
            <ToolResultBox title="Edited PDF ready">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Output file"
                  value={downloadName || "Edited PDF"}
                />

                <StatCard
                  label="Output size"
                  value={formatFileSize(outputSize)}
                />

                <StatCard
                  label="Pages remaining"
                  value={String(pagesRemaining)}
                  highlight
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => triggerDownload(downloadUrl, downloadName)}
                  className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Download again
                </button>
              </div>
            </ToolResultBox>
          )}
        </>
      ) : (
        !reading && (
          <ToolInfoBox>
            Upload a PDF to choose pages to remove and create a new edited PDF
            file.
          </ToolInfoBox>
        )
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={removeSelectedPages}
          disabled={
            !file ||
            !selectedPages.length ||
            !pageCount ||
            selectedPages.length >= pageCount ||
            loading ||
            reading
          }
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Removing pages..." : "Remove pages"}
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
        Your PDF is processed locally in your browser. The file is not uploaded
        to Toollane servers.
      </ToolInfoBox>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black"
      }`}
    >
      <div
        className={`text-xs font-bold uppercase tracking-wide ${
          highlight ? "text-white/50" : "text-black/40"
        }`}
      >
        {label}
      </div>

      <div className="mt-2 truncate text-lg font-black">{value}</div>
    </div>
  );
}