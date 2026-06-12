"use client";

import { useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type ImageQuality = "small" | "high" | "maximum";
type OutputResolution = "standard" | "high" | "very-high";

type ConvertedPage = {
  page: number;
  url: string;
  size: number;
  width: number;
  height: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function getQualityValue(quality: ImageQuality) {
  if (quality === "small") return 0.75;
  if (quality === "maximum") return 1;
  return 0.92;
}

function getScaleValue(resolution: OutputResolution) {
  if (resolution === "standard") return 1;
  if (resolution === "very-high") return 3;
  return 2;
}

function createSafeBaseName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\.pdf$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "pdf-pages"
  );
}

export default function PdfToJpgClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState<ImageQuality>("high");
  const [resolution, setResolution] = useState<OutputResolution>("high");
  const [outputName, setOutputName] = useState("pdf-pages");
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const totalOutputSize = useMemo(
    () => convertedPages.reduce((sum, page) => sum + page.size, 0),
    [convertedPages]
  );

  function revokeConvertedPages() {
    convertedPages.forEach((page) => URL.revokeObjectURL(page.url));
    setConvertedPages([]);
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeConvertedPages();
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
      setFile(null);
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
      setOutputName(createSafeBaseName(selectedFile.name));

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError(
        "Could not read this PDF file. Please make sure it is a valid, unlocked PDF document."
      );
      setFile(null);
      setPageCount(null);
    } finally {
      setReading(false);
    }
  }

  function clearFile() {
    revokeConvertedPages();

    setFile(null);
    setPageCount(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokeConvertedPages();

    setFile(null);
    setPageCount(null);
    setQuality("high");
    setResolution("high");
    setOutputName("pdf-pages");
    setLoading(false);
    setReading(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertPdfToJpg() {
    setError("");
    revokeConvertedPages();

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

      const nextPages: ConvertedPage[] = [];
      const scale = getScaleValue(resolution);
      const jpgQuality = getQualityValue(quality);

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
          canvas.toBlob(resolve, "image/jpeg", jpgQuality);
        });

        if (!blob) {
          throw new Error("Could not create JPG image.");
        }

        nextPages.push({
          page: pageNumber,
          url: URL.createObjectURL(blob),
          size: blob.size,
          width: canvas.width,
          height: canvas.height,
        });
      }

      setConvertedPages(nextPages);
    } catch {
      setError(
        "Something went wrong while converting the PDF. Please try another valid, unlocked PDF file."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadPage(page: ConvertedPage) {
    const link = document.createElement("a");

    link.href = page.url;
    link.download = `${createSafeBaseName(outputName)}-page-${page.page}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadAllPages() {
    convertedPages.forEach((page) => downloadPage(page));
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert PDF to JPG online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PDF file and convert every page into a high-quality JPG image
          directly in your browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Selected file" value={file ? "1 PDF" : "0 PDFs"} />
        <StatCard label="Pages" value={pageCount ? String(pageCount) : "0"} />
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
          void handleFiles(event.dataTransfer.files);
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
          Select one PDF file. Your document stays in your browser and is not
          uploaded to a server.
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
            revokeConvertedPages();
            setOutputName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          Files will be saved as {createSafeBaseName(outputName)}-page-1.jpg,
          {` `}
          {createSafeBaseName(outputName)}-page-2.jpg and so on.
        </p>
      </label>

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
                  onChange={(event) => {
                    revokeConvertedPages();
                    setQuality(event.target.value as ImageQuality);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="small">Smaller file</option>
                  <option value="high">High quality</option>
                  <option value="maximum">Maximum quality</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Output resolution
                </span>

                <select
                  value={resolution}
                  onChange={(event) => {
                    revokeConvertedPages();
                    setResolution(event.target.value as OutputResolution);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High</option>
                  <option value="very-high">Very high</option>
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertPdfToJpg}
          disabled={!file || loading || reading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Converting PDF..." : "Convert to JPG"}
        </button>

        {convertedPages.length > 0 && (
          <button
            type="button"
            onClick={downloadAllPages}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download all again
          </button>
        )}

        <button
          type="button"
          onClick={clearFile}
          disabled={!file || loading || reading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear file
        </button>

        <button
          type="button"
          onClick={resetTool}
          disabled={loading || reading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {convertedPages.length > 0 && (
        <>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-black">
              JPG images ready
            </h3>

            <p className="mt-3 text-sm leading-7 text-black/60">
              Your PDF pages have been converted into JPG images. You can
              download each page separately or download all pages again.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Converted pages"
                value={String(convertedPages.length)}
              />
              <StatCard
                label="Output size"
                value={formatFileSize(totalOutputSize)}
              />
              <StatCard
                label="Resolution"
                value={
                  resolution === "very-high"
                    ? "Very high"
                    : resolution === "high"
                      ? "High"
                      : "Standard"
                }
              />
            </div>
          </div>

          <ToolResultBox title="Converted JPG files">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {convertedPages.map((page) => (
                <div
                  key={page.page}
                  className="rounded-[2rem] border border-black/10 bg-white p-4"
                >
                  <img
                    src={page.url}
                    alt={`PDF page ${page.page}`}
                    className="aspect-[3/4] w-full rounded-[1.5rem] border border-black/10 object-contain"
                  />

                  <div className="mt-4">
                    <div className="text-sm font-bold text-black">
                      Page {page.page}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {page.width} × {page.height} ·{" "}
                      {formatFileSize(page.size)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadPage(page)}
                    className="mt-4 w-full rounded-xl border border-black/10 px-4 py-3 text-sm font-bold transition hover:bg-black/5"
                  >
                    Download page {page.page}
                  </button>
                </div>
              ))}
            </div>
          </ToolResultBox>
        </>
      )}

      <ToolInfoBox>
        All conversion happens locally in your browser. Your PDF file is not
        uploaded to Toollane servers.
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