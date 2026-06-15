"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function getResolutionLabel(resolution: OutputResolution) {
  if (resolution === "very-high") return "Very high";
  if (resolution === "high") return "High";

  return "Standard";
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

export default function PdfToJpgClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [quality, setQuality] = useState<ImageQuality>("high");
  const [resolution, setResolution] = useState<OutputResolution>("high");
  const [outputName, setOutputName] = useState("pdf-pages");
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progressPage, setProgressPage] = useState(0);
  const [error, setError] = useState("");

  const totalOutputSize = useMemo(
    () => convertedPages.reduce((sum, page) => sum + page.size, 0),
    [convertedPages]
  );

  const safeOutputName = createSafeBaseName(outputName);

  useEffect(() => {
    return () => {
      convertedPages.forEach((page) => URL.revokeObjectURL(page.url));
    };
  }, [convertedPages]);

  function clearConvertedPages() {
    convertedPages.forEach((page) => URL.revokeObjectURL(page.url));
    setConvertedPages([]);
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    clearConvertedPages();
    setPageCount(null);
    setSelectedPages([]);
    setPageRange("1");

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

      const defaultRange = pdf.numPages > 1 ? `1-${pdf.numPages}` : "1";

      setFile(selectedFile);
      setPageCount(pdf.numPages);
      setPageRange(defaultRange);
      setSelectedPages(parsePageRanges(defaultRange, pdf.numPages));
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
      setSelectedPages([]);
    } finally {
      setReading(false);
    }
  }

  function updatePageRange(value: string) {
    setPageRange(value);
    setError("");
    clearConvertedPages();

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

  function clearFile() {
    clearConvertedPages();

    setFile(null);
    setPageCount(null);
    setPageRange("1");
    setSelectedPages([]);
    setProgressPage(0);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    clearConvertedPages();

    setFile(null);
    setPageCount(null);
    setPageRange("1");
    setSelectedPages([]);
    setQuality("high");
    setResolution("high");
    setOutputName("pdf-pages");
    setLoading(false);
    setReading(false);
    setDragActive(false);
    setProgressPage(0);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertPdfToJpg() {
    setError("");
    clearConvertedPages();

    if (!file || !pageCount) {
      setError("Please select a PDF file first.");
      return;
    }

    let pagesToConvert: number[];

    try {
      pagesToConvert = parsePageRanges(pageRange, pageCount);
    } catch {
      setError(
        `Please enter valid pages between 1 and ${pageCount}. Example: 1,3,5-7`
      );
      return;
    }

    if (!pagesToConvert.length) {
      setError("Please select at least one page to convert.");
      return;
    }

    const nextPages: ConvertedPage[] = [];

    setLoading(true);
    setProgressPage(0);

    try {
      const bytes = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: bytes,
      }).promise;

      const scale = getScaleValue(resolution);
      const jpgQuality = getQualityValue(quality);

      for (let index = 0; index < pagesToConvert.length; index += 1) {
        const pageNumber = pagesToConvert[index];

        setProgressPage(index + 1);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas is not supported.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

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
      nextPages.forEach((page) => URL.revokeObjectURL(page.url));

      setError(
        "Something went wrong while converting the PDF. Please try another valid, unlocked PDF file."
      );
    } finally {
      setLoading(false);
      setProgressPage(0);
    }
  }

  function downloadPage(page: ConvertedPage) {
    const link = document.createElement("a");

    link.href = page.url;
    link.download = `${safeOutputName}-page-${page.page}.jpg`;

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
          Upload a PDF file, choose pages, quality and resolution, then convert
          selected PDF pages into high-quality JPG images directly in your
          browser.
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
          disabled={reading || loading}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {reading ? "Reading PDF..." : "Choose PDF file"}
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

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Total pages" value={String(pageCount)} />

              <StatCard
                label="Selected pages"
                value={String(selectedPages.length)}
                highlight={selectedPages.length > 0}
              />

              <StatCard
                label="Resolution"
                value={getResolutionLabel(resolution)}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-black">
                Pages to convert
              </label>

              <input
                value={pageRange}
                onChange={(event) => updatePageRange(event.target.value)}
                placeholder="Example: 1,3,5-7"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs leading-5 text-black/50">
                Use commas and ranges. Example: 1,3,5-7. Duplicate pages are
                ignored.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Selection preview
              </div>

              <div className="mt-2 text-sm font-bold leading-6 text-black">
                {formatPagePreview(selectedPages)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updatePageRange("1")}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                First page
              </button>

              <button
                type="button"
                onClick={() => updatePageRange(String(pageCount))}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Last page
              </button>

              <button
                type="button"
                onClick={() => updatePageRange(`1-${pageCount}`)}
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                All pages
              </button>

              <button
                type="button"
                onClick={() =>
                  updatePageRange(formatPagesAsRange(getOddPages(pageCount)))
                }
                disabled={loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Odd pages
              </button>

              <button
                type="button"
                onClick={() =>
                  updatePageRange(formatPagesAsRange(getEvenPages(pageCount)))
                }
                disabled={loading || pageCount < 2}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Even pages
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  Image quality
                </span>

                <select
                  value={quality}
                  onChange={(event) => {
                    clearConvertedPages();
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
                    clearConvertedPages();
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

            <label className="block">
              <span className="text-sm font-bold text-black">
                Output file name
              </span>

              <input
                type="text"
                value={outputName}
                onChange={(event) => {
                  clearConvertedPages();
                  setOutputName(event.target.value);
                }}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs leading-5 text-black/50">
                Files will be saved as {safeOutputName}-page-1.jpg,{" "}
                {safeOutputName}-page-2.jpg and so on.
              </p>
            </label>
          </div>
        </ToolResultBox>
      ) : (
        !reading && (
          <ToolInfoBox>
            Upload a PDF file to convert selected pages into downloadable JPG
            images.
          </ToolInfoBox>
        )
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertPdfToJpg}
          disabled={!file || !selectedPages.length || loading || reading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? `Converting ${progressPage || 1} of ${selectedPages.length}...`
            : "Convert to JPG"}
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
              Your selected PDF pages have been converted into JPG images. You
              can download each page separately or download all pages again.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Converted pages"
                value={String(convertedPages.length)}
                highlight
              />

              <StatCard
                label="Output size"
                value={formatFileSize(totalOutputSize)}
              />

              <StatCard label="Resolution" value={getResolutionLabel(resolution)} />
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
      className={`rounded-2xl border p-5 shadow-sm ${
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