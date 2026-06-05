"use client";

import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type ConvertedPage = {
  page: number;
  url: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PdfToJpgClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(2);
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    setConvertedPages([]);
    setPageCount(null);

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

    setReading(true);

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: bytes,
      }).promise;

      setFile(selectedFile);
      setPageCount(pdf.numPages);
    } catch {
      setError(
        "Could not read this PDF file. Please make sure it is a valid, unlocked PDF."
      );
      setFile(null);
    } finally {
      setReading(false);
    }
  }

  function clearFile() {
    convertedPages.forEach((page) => URL.revokeObjectURL(page.url));

    setFile(null);
    setPageCount(null);
    setConvertedPages([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertPdfToJpg() {
    setError("");

    convertedPages.forEach((page) => URL.revokeObjectURL(page.url));
    setConvertedPages([]);

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: bytes,
      }).promise;

      const pages: ConvertedPage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
        canvasContext: context,
        viewport,
        canvas,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", quality);
        });

        if (!blob) {
          throw new Error("Could not create JPG image.");
        }

        const url = URL.createObjectURL(blob);

        pages.push({
          page: pageNumber,
          url,
        });
      }

      setConvertedPages(pages);
    } catch {
      setError(
        "Something went wrong while converting the PDF. Please try another PDF file."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadPage(page: ConvertedPage) {
    const link = document.createElement("a");

    link.href = page.url;
    link.download = `page-${page.page}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadAllPages() {
    convertedPages.forEach((page) => {
      downloadPage(page);
    });
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert PDF to JPG
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF and convert every page into a JPG image directly in your
          browser.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            if (event.target.files) {
              void handleFiles(event.target.files);
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
          Your PDF stays in your browser and is not uploaded.
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

      {reading && <ToolInfoBox>Reading PDF file...</ToolInfoBox>}

      {file && pageCount ? (
        <ToolResultBox title="Selected PDF">
          <div className="grid gap-5">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>

              <div className="mt-1 text-xs text-black/50">
                {formatFileSize(file.size)} · {pageCount} pages
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  Image quality
                </span>

                <select
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                >
                  <option value={0.75}>Smaller file</option>
                  <option value={0.92}>High quality</option>
                  <option value={1}>Maximum quality</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Output resolution
                </span>

                <select
                  value={scale}
                  onChange={(event) => setScale(Number(event.target.value))}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                >
                  <option value={1}>Standard</option>
                  <option value={2}>High</option>
                  <option value={3}>Very high</option>
                </select>
              </label>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        !reading && (
          <ToolInfoBox>
            Upload a PDF file to convert each page into a downloadable JPG
            image.
          </ToolInfoBox>
        )
      )}

      {convertedPages.length > 0 && (
        <ToolResultBox title="Converted JPG files">
          <div className="grid gap-4">
            <button
              type="button"
              onClick={downloadAllPages}
              className="rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Download all JPG files
            </button>

            <div className="grid gap-3 sm:grid-cols-2">
              {convertedPages.map((page) => (
                <div
                  key={page.page}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <img
                    src={page.url}
                    alt={`PDF page ${page.page}`}
                    className="aspect-[3/4] w-full rounded-xl border border-black/10 object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => downloadPage(page)}
                    className="mt-3 w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-bold transition hover:bg-black/5"
                  >
                    Download page {page.page}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertPdfToJpg}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Converting PDF..." : "Convert to JPG"}
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