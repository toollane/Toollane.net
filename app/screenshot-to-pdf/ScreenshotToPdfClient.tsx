"use client";

import { jsPDF } from "jspdf";
import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PdfFormat = "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";

type ScreenshotImage = {
  id: string;
  file: File;
  previewUrl: string;
  dataUrl: string;
  width: number;
  height: number;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
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

  return `${cleaned || "screenshots"}.pdf`;
}

function createScreenshotId(file: File) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${file.name}-${file.size}-${crypto.randomUUID()}`;
  }

  return `${file.name}-${file.size}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return 0;

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getCompressionMode(quality: number): "FAST" | "MEDIUM" | "SLOW" {
  if (quality >= 0.9) return "SLOW";
  if (quality >= 0.7) return "MEDIUM";

  return "FAST";
}

function isSupportedImage(file: File) {
  const name = file.name.toLowerCase();

  return (
    file.type.startsWith("image/") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".webp")
  );
}

function readScreenshotFile(file: File) {
  return new Promise<ScreenshotImage>((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const image = new Image();

      image.onload = () => {
        resolve({
          id: createScreenshotId(file),
          file,
          previewUrl,
          dataUrl,
          width: image.width,
          height: image.height,
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        reject(new Error("Invalid screenshot image."));
      };

      image.src = dataUrl;
    };

    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("Could not read screenshot image."));
    };

    reader.readAsDataURL(file);
  });
}

function convertImageToJpegDataUrl(dataUrl: string, quality: number) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas is not supported."));
        return;
      }

      canvas.width = image.width;
      canvas.height = image.height;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    image.onerror = () => reject(new Error("Could not convert image."));

    image.src = dataUrl;
  });
}

export default function ScreenshotToPdfClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotsRef = useRef<ScreenshotImage[]>([]);
  const pdfUrlRef = useRef("");

  const [screenshots, setScreenshots] = useState<ScreenshotImage[]>([]);
  const [fileName, setFileName] = useState("screenshots.pdf");
  const [pdfFormat, setPdfFormat] = useState<PdfFormat>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState("16");
  const [jpegQuality, setJpegQuality] = useState(0.9);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfSize, setPdfSize] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadingImages, setIsReadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progressPage, setProgressPage] = useState(0);
  const [error, setError] = useState("");

  const totalSize = useMemo(
    () => screenshots.reduce((sum, item) => sum + item.file.size, 0),
    [screenshots]
  );

  const safePdfName = createSafeFileName(fileName);
  const marginValue = parseNumber(margin);

  useEffect(() => {
    screenshotsRef.current = screenshots;
  }, [screenshots]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      screenshotsRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl)
      );

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  function revokePdfUrl() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
      setPdfSize(0);
    }
  }

  function clearScreenshotPreviews(items: ScreenshotImage[]) {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  }

  async function addScreenshots(selectedFiles: FileList | File[]) {
    setError("");
    revokePdfUrl();

    const files = Array.from(selectedFiles);
    const imageFiles = files.filter(isSupportedImage);

    if (!imageFiles.length) {
      setError("Please upload at least one screenshot image.");
      return;
    }

    setIsReadingImages(true);

    try {
      const processed = await Promise.all(imageFiles.map(readScreenshotFile));

      setScreenshots((current) => {
        const existingKeys = new Set(
          current.map((item) => `${item.file.name}-${item.file.size}`)
        );

        const newScreenshots = processed.filter(
          (item) => !existingKeys.has(`${item.file.name}-${item.file.size}`)
        );

        const duplicates = processed.filter((item) =>
          existingKeys.has(`${item.file.name}-${item.file.size}`)
        );

        clearScreenshotPreviews(duplicates);

        if (!newScreenshots.length) {
          setError("These screenshots are already in the list.");
          return current;
        }

        return [...current, ...newScreenshots];
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setError("Could not read one or more screenshots.");
    } finally {
      setIsReadingImages(false);
    }
  }

  function moveScreenshot(index: number, direction: "up" | "down") {
    revokePdfUrl();

    setScreenshots((current) => {
      const target = direction === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= current.length) return current;

      const next = [...current];

      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  }

  function removeScreenshot(id: string) {
    revokePdfUrl();

    setScreenshots((current) => {
      const item = current.find((screenshot) => screenshot.id === id);

      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }

      return current.filter((screenshot) => screenshot.id !== id);
    });
  }

  function sortScreenshotsByName() {
    revokePdfUrl();

    setScreenshots((current) =>
      [...current].sort((a, b) => a.file.name.localeCompare(b.file.name))
    );
  }

  function reverseScreenshotOrder() {
    revokePdfUrl();
    setScreenshots((current) => [...current].reverse());
  }

  async function generatePdf() {
    setError("");
    revokePdfUrl();

    if (!screenshots.length) {
      setError("Upload at least one screenshot first.");
      return;
    }

    if (marginValue < 0 || marginValue > 200) {
      setError("Margin must be between 0 and 200 px.");
      return;
    }

    try {
      setIsGenerating(true);
      setProgressPage(0);

      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: pdfFormat,
        compress: true,
      });

      const compressionMode = getCompressionMode(jpegQuality);

      for (let index = 0; index < screenshots.length; index += 1) {
        const screenshot = screenshots[index];

        setProgressPage(index + 1);

        if (index > 0) {
          pdf.addPage(pdfFormat, orientation);
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const usableWidth = pageWidth - marginValue * 2;
        const usableHeight = pageHeight - marginValue * 2;

        if (usableWidth <= 0 || usableHeight <= 0) {
          throw new Error("Margin is too large.");
        }

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
        const jpegDataUrl = await convertImageToJpegDataUrl(
          screenshot.dataUrl,
          jpegQuality
        );

        pdf.addImage(
          jpegDataUrl,
          "JPEG",
          x,
          y,
          drawWidth,
          drawHeight,
          undefined,
          compressionMode
        );
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfSize(blob.size);

      const link = document.createElement("a");

      link.href = url;
      link.download = safePdfName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Could not generate PDF from screenshots.");
    } finally {
      setIsGenerating(false);
      setProgressPage(0);
    }
  }

  function downloadPdf() {
    if (!pdfUrl) return;

    const link = document.createElement("a");

    link.href = pdfUrl;
    link.download = safePdfName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function clearScreenshots() {
    revokePdfUrl();
    clearScreenshotPreviews(screenshots);
    setScreenshots([]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetTool() {
    revokePdfUrl();
    clearScreenshotPreviews(screenshots);

    setScreenshots([]);
    setFileName("screenshots.pdf");
    setPdfFormat("a4");
    setOrientation("portrait");
    setFitMode("contain");
    setMargin("16");
    setJpegQuality(0.9);
    setIsGenerating(false);
    setIsReadingImages(false);
    setDragActive(false);
    setProgressPage(0);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert screenshots to PDF online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert mobile or desktop screenshots into a clean PDF document with
          page order, margins, page size, orientation and quality settings.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h3 className="text-lg font-black text-black">
          Useful for mobile screenshots
        </h3>

        <div className="mt-4 grid gap-3 text-sm leading-6 text-black/70 sm:grid-cols-2">
          <div>• Combine multiple screenshots into one PDF</div>
          <div>• Reorder screenshots before export</div>
          <div>• Keep full screenshots visible with contain mode</div>
          <div>• Create PDFs for receipts, chats, tickets and reports</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard
          label="Screenshots"
          value={screenshots.length.toLocaleString()}
          highlight={screenshots.length > 0}
        />

        <ResultCard label="Upload size" value={formatBytes(totalSize)} />

        <ResultCard label="Privacy" value="Browser-based" />
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
          void addScreenshots(event.dataTransfer.files);
        }}
        className={`rounded-[2rem] border-2 border-dashed p-6 text-center transition sm:p-8 ${
          dragActive
            ? "border-black bg-[#fff3bd]"
            : "border-black/15 bg-white hover:border-black/25"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              void addScreenshots(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          IMG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop screenshots here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Select one or multiple screenshot images from your phone or desktop.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReadingImages || isGenerating}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isReadingImages ? "Reading screenshots..." : "Choose screenshots"}
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Output file name</span>

        <input
          type="text"
          value={fileName}
          onChange={(event) => {
            revokePdfUrl();
            setFileName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          The file will be saved as {safePdfName}.
        </p>
      </label>

      {error && <ToolErrorBox message={error} />}

      {isReadingImages && (
        <ToolInfoBox>Reading screenshots and creating previews...</ToolInfoBox>
      )}

      {!!screenshots.length ? (
        <>
          <ToolResultBox title="PDF settings">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  PDF format
                </span>

                <select
                  value={pdfFormat}
                  onChange={(event) => {
                    revokePdfUrl();
                    setPdfFormat(event.target.value as PdfFormat);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="a4">A4</option>
                  <option value="letter">US Letter</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Orientation
                </span>

                <select
                  value={orientation}
                  onChange={(event) => {
                    revokePdfUrl();
                    setOrientation(event.target.value as Orientation);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Fit mode</span>

                <select
                  value={fitMode}
                  onChange={(event) => {
                    revokePdfUrl();
                    setFitMode(event.target.value as FitMode);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="contain">Contain full screenshot</option>
                  <option value="cover">Fill page</option>
                </select>
              </label>

              <TextNumberInput
                label="Margin"
                value={margin}
                onChange={(value) => {
                  revokePdfUrl();
                  setMargin(value);
                }}
                suffix="px"
              />

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
                  onChange={(event) => {
                    revokePdfUrl();
                    setJpegQuality(Number(event.target.value));
                  }}
                  className="mt-5 w-full"
                />

                <p className="mt-2 text-xs leading-5 text-black/50">
                  Higher quality may create a larger PDF.
                </p>
              </label>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Screenshot order">
            <div className="mb-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              The PDF page order follows the screenshot list below. Move
              screenshots up or down before creating your PDF.
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={sortScreenshotsByName}
                disabled={screenshots.length < 2 || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Sort A-Z
              </button>

              <button
                type="button"
                onClick={reverseScreenshotOrder}
                disabled={screenshots.length < 2 || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Reverse order
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isReadingImages || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Add more screenshots
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot.id}
                  className="rounded-[2rem] border border-black/10 bg-white p-4"
                >
                  <img
                    src={screenshot.previewUrl}
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
                      disabled={index === 0 || isGenerating}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black transition hover:border-black disabled:opacity-40"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, "down")}
                      disabled={index === screenshots.length - 1 || isGenerating}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black transition hover:border-black disabled:opacity-40"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeScreenshot(screenshot.id)}
                      disabled={isGenerating}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ToolResultBox>

          <ToolResultBox title="PDF summary">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="PDF pages"
                value={screenshots.length.toLocaleString()}
                highlight
              />

              <ResultCard label="Upload size" value={formatBytes(totalSize)} />

              <ResultCard
                label="PDF size"
                value={pdfSize ? formatBytes(pdfSize) : "Not generated"}
              />
            </div>
          </ToolResultBox>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={generatePdf}
              disabled={isGenerating || isReadingImages}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating
                ? `Creating ${progressPage || 1} of ${screenshots.length}...`
                : "Create PDF"}
            </button>

            {pdfUrl && (
              <button
                type="button"
                onClick={downloadPdf}
                className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
              >
                Download again
              </button>
            )}

            <button
              type="button"
              onClick={clearScreenshots}
              disabled={isGenerating || isReadingImages}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear screenshots
            </button>

            <button
              type="button"
              onClick={resetTool}
              disabled={isGenerating || isReadingImages}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <ToolInfoBox>
          Add one or more screenshots to create a PDF. You can reorder
          screenshots, adjust page settings and download the finished file
          instantly.
        </ToolInfoBox>
      )}

      {pdfUrl && (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-black">PDF ready</h3>

          <p className="mt-3 text-sm leading-7 text-black/60">
            Your screenshots have been converted into a PDF and downloaded. You
            can download it again without reprocessing the screenshots.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ResultCard label="Output file" value={safePdfName} highlight />

            <ResultCard
              label="Output size"
              value={pdfSize ? formatBytes(pdfSize) : "Ready"}
            />

            <ResultCard label="PDF pages" value={String(screenshots.length)} />
          </div>
        </div>
      )}

      <ToolInfoBox>
        Screenshot to PDF conversion happens locally in your browser. This is
        ideal for mobile screenshots, receipts, proof screenshots, app screens
        and documentation.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        {suffix && (
          <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
            {suffix}
          </div>
        )}
      </div>
    </label>
  );
}

function ResultCard({
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
      className={`rounded-2xl border p-5 ${
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

      <div className="mt-2 truncate text-xl font-black">{value}</div>
    </div>
  );
}