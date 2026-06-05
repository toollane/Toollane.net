"use client";

import { jsPDF } from "jspdf";
import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PdfFormat = "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";

type UploadedJpg = {
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

export default function JpgToPdfClient() {
  const [images, setImages] = useState<UploadedJpg[]>([]);
  const [pdfFormat, setPdfFormat] = useState<PdfFormat>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState(20);
  const [jpegQuality, setJpegQuality] = useState(0.92);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfSize, setPdfSize] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const totalUploadSize = useMemo(() => {
    return images.reduce((sum, image) => sum + image.file.size, 0);
  }, [images]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    try {
      const jpgFiles = files.filter((file) => {
        const name = file.name.toLowerCase();
        return (
          file.type === "image/jpeg" ||
          name.endsWith(".jpg") ||
          name.endsWith(".jpeg")
        );
      });

      if (!jpgFiles.length) {
        setError("Please upload JPG or JPEG images.");
        return;
      }

      const processed = await Promise.all(
        jpgFiles.map(
          (file) =>
            new Promise<UploadedJpg>((resolve, reject) => {
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

      setImages((current) => [...current, ...processed]);
      setPdfUrl("");
      setPdfSize(0);
      setError("");
    } catch {
      setError("Could not read one or more JPG images.");
    }
  }

  async function generatePdf() {
    if (!images.length) {
      setError("Upload at least one JPG image first.");
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

      for (let index = 0; index < images.length; index++) {
        const image = images[index];

        if (index > 0) {
          pdf.addPage();
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        const imageRatio = image.width / image.height;
        const pageRatio = usableWidth / usableHeight;

        let drawWidth = usableWidth;
        let drawHeight = usableHeight;

        if (fitMode === "contain") {
          if (imageRatio > pageRatio) {
            drawHeight = usableWidth / imageRatio;
          } else {
            drawWidth = usableHeight * imageRatio;
          }
        }

        if (fitMode === "cover") {
          if (imageRatio > pageRatio) {
            drawWidth = usableHeight * imageRatio;
          } else {
            drawHeight = usableWidth / imageRatio;
          }
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        pdf.addImage(
          image.preview,
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
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfSize(blob.size);
    } catch {
      setError("Could not generate PDF from these JPG images.");
    } finally {
      setIsGenerating(false);
    }
  }

  function moveImage(index: number, direction: "up" | "down") {
    const next = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    setImages(next);
    setPdfUrl("");
    setPdfSize(0);
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id));
    setPdfUrl("");
    setPdfSize(0);
  }

  function downloadPdf() {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "jpg-images.pdf";
    link.click();
  }

  function resetTool() {
    setImages([]);
    setPdfFormat("a4");
    setOrientation("portrait");
    setFitMode("contain");
    setMargin(20);
    setJpegQuality(0.92);
    setPdfUrl("");
    setPdfSize(0);
    setIsGenerating(false);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          JPG to PDF Converter
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Convert one or multiple JPG images into a clean PDF document with page
          size, orientation, margin, fit mode and image quality settings.
        </p>
      </div>

      <label className="flex min-h-[240px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/jpeg,.jpg,.jpeg"
          multiple
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">Upload JPG images</div>

          <div className="mt-3 text-sm leading-6 text-black/60">
            Select one or multiple JPG/JPEG files. Each image becomes a PDF page.
          </div>

          {!!images.length && (
            <div className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {images.length} JPG image{images.length > 1 ? "s" : ""} added
            </div>
          )}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {!!images.length && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block">
              <span className="text-sm font-bold text-black">Page format</span>

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
                <option value="contain">Contain full image</option>
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

          <ToolResultBox title="JPG page order">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="rounded-[2rem] border border-black/10 bg-white p-4"
                >
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-cover"
                  />

                  <div className="mt-4">
                    <div className="line-clamp-1 text-sm font-bold text-black">
                      Page {index + 1}: {image.file.name}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {image.width} × {image.height} • {formatBytes(image.file.size)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
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
            <ResultCard label="Images" value={images.length.toLocaleString()} />
            <ResultCard label="Upload size" value={formatBytes(totalUploadSize)} />
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
        This JPG to PDF converter runs locally in your browser and is useful for
        receipts, documents, scanned pages, homework, applications and photo
        exports.
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