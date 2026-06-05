"use client";

import { jsPDF } from "jspdf";
import { useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PdfFormat = "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";

type ScreenshotImage = {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ScreenshotToPdfClient() {
  const [screenshots, setScreenshots] = useState<ScreenshotImage[]>([]);
  const [pdfFormat, setPdfFormat] = useState<PdfFormat>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState(16);
  const [jpegQuality, setJpegQuality] = useState(0.9);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfSize, setPdfSize] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalSize = useMemo(() => {
    return screenshots.reduce((sum, item) => sum + item.file.size, 0);
  }, [screenshots]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    try {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (!imageFiles.length) {
        setError("Please upload at least one screenshot image.");
        return;
      }

      const processed = await Promise.all(
        imageFiles.map(
          (file) =>
            new Promise<ScreenshotImage>((resolve, reject) => {
              const image = new Image();

              image.onload = () => {
                resolve({
                  id: crypto.randomUUID(),
                  file,
                  preview: URL.createObjectURL(file),
                  width: image.width,
                  height: image.height,
                });
              };

              image.onerror = reject;
              image.src = URL.createObjectURL(file);
            })
        )
      );

      setScreenshots((current) => [...current, ...processed]);
      setPdfUrl("");
      setPdfSize(0);
      setError("");
    } catch {
      setError("Could not read one or more screenshots.");
    }
  }

  function moveScreenshot(index: number, direction: "up" | "down") {
    const next = [...screenshots];
    const target = direction === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= screenshots.length) return;

    [next[index], next[target]] = [next[target], next[index]];
    setScreenshots(next);
    setPdfUrl("");
    setPdfSize(0);
  }

  function removeScreenshot(id: string) {
    setScreenshots((current) => current.filter((item) => item.id !== id));
    setPdfUrl("");
    setPdfSize(0);
  }

  async function generatePdf() {
    if (!screenshots.length) {
      setError("Upload at least one screenshot first.");
      return;
    }

    if (margin < 0) {
      setError("Margin cannot be negative.");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: pdfFormat,
      });

      for (let index = 0; index < screenshots.length; index++) {
        const screenshot = screenshots[index];

        if (index > 0) {
          pdf.addPage();
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        const imageRatio = screenshot.width / screenshot.height;
        const pageRatio = usableWidth / usableHeight;

        let drawWidth = usableWidth;
        let drawHeight = usableHeight;

        if (fitMode === "contain") {
          if (imageRatio > pageRatio) {
            drawHeight = usableWidth / imageRatio;
          } else {
            drawWidth = usableHeight * imageRatio;
          }
        } else {
          if (imageRatio > pageRatio) {
            drawWidth = usableHeight * imageRatio;
          } else {
            drawHeight = usableWidth / imageRatio;
          }
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        pdf.addImage(
          screenshot.preview,
          "JPEG",
          x,
          y,
          drawWidth,
          drawHeight,
          undefined,
          jpegQuality >= 0.85 ? "SLOW" : "FAST"
        );
      }

      const blob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(blob));
      setPdfSize(blob.size);
    } catch {
      setError("Could not generate PDF from screenshots.");
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadPdf() {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "screenshots.pdf";
    link.click();
  }

  function resetTool() {
    setScreenshots([]);
    setPdfFormat("a4");
    setOrientation("portrait");
    setFitMode("contain");
    setMargin(16);
    setJpegQuality(0.9);
    setPdfUrl("");
    setPdfSize(0);
    setIsGenerating(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Screenshot to PDF Converter
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Convert mobile or desktop screenshots into a clean PDF document with
          page order, margins, page size, orientation and quality settings.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Useful for mobile screenshots
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>• Combine multiple screenshots into one PDF</li>
          <li>• Reorder screenshots before export</li>
          <li>• Keep full screenshots visible with contain mode</li>
          <li>• Create PDFs for receipts, chats, apps, tickets and reports</li>
        </ul>
      </div>

      <label className="flex min-h-[240px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload screenshots
          </div>

          <div className="mt-3 text-sm leading-6 text-black/60">
            Select one or multiple screenshot images from your phone or desktop
          </div>

          {!!screenshots.length && (
            <div className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {screenshots.length} screenshot{screenshots.length > 1 ? "s" : ""} added
            </div>
          )}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {!!screenshots.length && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block">
              <span className="text-sm font-bold text-black">PDF format</span>

              <select
                value={pdfFormat}
                onChange={(event) => setPdfFormat(event.target.value as PdfFormat)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
              >
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Orientation</span>

              <select
                value={orientation}
                onChange={(event) => setOrientation(event.target.value as Orientation)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Fit mode</span>

              <select
                value={fitMode}
                onChange={(event) => setFitMode(event.target.value as FitMode)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
              >
                <option value="contain">Contain full screenshot</option>
                <option value="cover">Fill page</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Margin px</span>

              <input
                type="number"
                value={margin}
                onChange={(event) => setMargin(Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">
                Quality: {Math.round(jpegQuality * 100)}%
              </span>

              <input
                type="range"
                min="0.4"
                max="1"
                step="0.05"
                value={jpegQuality}
                onChange={(event) => setJpegQuality(Number(event.target.value))}
                className="mt-5 w-full"
              />
            </label>
          </div>

          <ToolResultBox title="Screenshot order">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot.id}
                  className="rounded-[2rem] border border-black/10 bg-white p-4"
                >
                  <img
                    src={screenshot.preview}
                    alt={screenshot.file.name}
                    className="aspect-[9/16] w-full rounded-[1.5rem] border border-black/10 object-cover"
                  />

                  <div className="mt-4">
                    <div className="line-clamp-1 text-sm font-bold text-black">
                      Page {index + 1}: {screenshot.file.name}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {screenshot.width} × {screenshot.height} •{" "}
                      {formatBytes(screenshot.file.size)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, "up")}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, "down")}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeScreenshot(screenshot.id)}
                      className="rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ToolResultBox>

          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard label="Screenshots" value={screenshots.length.toLocaleString()} />
            <ResultCard label="Upload size" value={formatBytes(totalSize)} />
            <ResultCard label="PDF size" value={pdfSize ? formatBytes(pdfSize) : "Not generated"} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={generatePdf}
              disabled={isGenerating}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isGenerating ? "Generating PDF..." : "Generate PDF"}
            </button>

            <button
              type="button"
              onClick={downloadPdf}
              disabled={!pdfUrl}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
            >
              Download PDF
            </button>

            <button
              type="button"
              onClick={resetTool}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
            >
              Reset
            </button>
          </div>
        </>
      )}

      <ToolInfoBox>
        Screenshot to PDF conversion happens locally in your browser. This is
        ideal for mobile screenshots, receipts, proof screenshots, app screens
        and documentation.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}