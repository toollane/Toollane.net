"use client";

import { jsPDF } from "jspdf";
import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PdfFormat = "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";
type MarginSize = "none" | "small" | "medium";

type UploadedJpg = {
  id: string;
  file: File;
  preview: string;
  dataUrl: string;
  width: number;
  height: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function createSafeFileName(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${cleaned || "jpg-images"}.pdf`;
}

function createImageId(file: File) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${file.name}-${file.size}-${crypto.randomUUID()}`;
  }

  return `${file.name}-${file.size}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function getMarginValue(margin: MarginSize) {
  if (margin === "none") return 0;
  if (margin === "small") return 18;

  return 36;
}

function getCompressionMode(quality: number) {
  if (quality >= 0.9) return "SLOW";
  if (quality >= 0.7) return "MEDIUM";

  return "FAST";
}

function readImageFile(file: File) {
  return new Promise<UploadedJpg>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const image = new Image();

      image.onload = () => {
        resolve({
          id: createImageId(file),
          file,
          preview: URL.createObjectURL(file),
          dataUrl,
          width: image.width,
          height: image.height,
        });
      };

      image.onerror = reject;
      image.src = dataUrl;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function JpgToPdfClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef<UploadedJpg[]>([]);
  const pdfUrlRef = useRef("");

  const [images, setImages] = useState<UploadedJpg[]>([]);
  const [fileName, setFileName] = useState("jpg-images.pdf");
  const [pdfFormat, setPdfFormat] = useState<PdfFormat>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState<MarginSize>("small");
  const [jpegQuality, setJpegQuality] = useState(0.92);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadingImages, setIsReadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const totalUploadSize = useMemo(
    () => images.reduce((sum, image) => sum + image.file.size, 0),
    [images]
  );

  const averageImageSize = images.length > 0 ? totalUploadSize / images.length : 0;
  const safePdfName = createSafeFileName(fileName);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  function revokePdfUrl() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
      setPdfSize(null);
    }
  }

  function clearImagePreviews(items: UploadedJpg[]) {
    items.forEach((image) => URL.revokeObjectURL(image.preview));
  }

  async function addImages(selectedFiles: FileList | File[]) {
    setError("");
    revokePdfUrl();

    const incomingFiles = Array.from(selectedFiles);

    const jpgFiles = incomingFiles.filter((file) => {
      const name = file.name.toLowerCase();

      return (
        file.type === "image/jpeg" ||
        file.type === "image/pjpeg" ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg")
      );
    });

    if (!jpgFiles.length) {
      setError("Please select valid JPG or JPEG images.");
      return;
    }

    setIsReadingImages(true);

    try {
      const processedImages = await Promise.all(jpgFiles.map(readImageFile));

      setImages((current) => {
        const existingKeys = new Set(
          current.map((image) => `${image.file.name}-${image.file.size}`)
        );

        const newImages = processedImages.filter(
          (image) => !existingKeys.has(`${image.file.name}-${image.file.size}`)
        );

        const duplicateImages = processedImages.filter((image) =>
          existingKeys.has(`${image.file.name}-${image.file.size}`)
        );

        clearImagePreviews(duplicateImages);

        if (!newImages.length) {
          setError("These JPG images are already in the list.");
          return current;
        }

        return [...current, ...newImages];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError(
        "Something went wrong while reading the JPG images. Please try again with valid JPG or JPEG files."
      );
    } finally {
      setIsReadingImages(false);
    }
  }

  function removeImage(id: string) {
    revokePdfUrl();

    setImages((current) => {
      const imageToRemove = current.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return current.filter((image) => image.id !== id);
    });
  }

  function clearImages() {
    revokePdfUrl();
    clearImagePreviews(images);
    setImages([]);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokePdfUrl();
    clearImagePreviews(images);

    setImages([]);
    setFileName("jpg-images.pdf");
    setPdfFormat("a4");
    setOrientation("portrait");
    setFitMode("contain");
    setMargin("small");
    setJpegQuality(0.92);
    setIsGenerating(false);
    setIsReadingImages(false);
    setDragActive(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function moveImage(id: string, direction: "up" | "down") {
    revokePdfUrl();

    setImages((current) => {
      const index = current.findIndex((image) => image.id === id);

      if (index === -1) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const updated = [...current];
      const temp = updated[index];

      updated[index] = updated[nextIndex];
      updated[nextIndex] = temp;

      return updated;
    });
  }

  function reverseImageOrder() {
    revokePdfUrl();
    setImages((current) => [...current].reverse());
  }

  function sortImagesByName() {
    revokePdfUrl();

    setImages((current) =>
      [...current].sort((a, b) => a.file.name.localeCompare(b.file.name))
    );
  }

  async function generatePdf() {
    setError("");
    revokePdfUrl();

    if (!images.length) {
      setError("Please select at least one JPG image.");
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: pdfFormat,
        compress: true,
      });

      const marginValue = getMarginValue(margin);
      const compressionMode = getCompressionMode(jpegQuality);

      images.forEach((image, index) => {
        if (index > 0) {
          pdf.addPage(pdfFormat, orientation);
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const usableWidth = pageWidth - marginValue * 2;
        const usableHeight = pageHeight - marginValue * 2;

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
          image.dataUrl,
          "JPEG",
          x,
          y,
          drawWidth,
          drawHeight,
          undefined,
          compressionMode
        );
      });

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
      setError(
        "Something went wrong while creating the PDF. Please try again with valid JPG or JPEG images."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadAgain() {
    if (!pdfUrl) return;

    const link = document.createElement("a");

    link.href = pdfUrl;
    link.download = safePdfName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert JPG to PDF online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload one or multiple JPG images, arrange the page order and create a
          clean PDF document directly in your browser.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Selected images" value={String(images.length)} />

        <StatCard label="Total size" value={formatFileSize(totalUploadSize)} />

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
          void addImages(event.dataTransfer.files);
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
          accept="image/jpeg,.jpg,.jpeg"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              void addImages(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          JPG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop JPG images here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Select one or multiple JPG/JPEG files. Each image becomes one PDF page.
          Your files stay in your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isReadingImages || isGenerating}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isReadingImages ? "Reading images..." : "Choose JPG images"}
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
        <ToolInfoBox>Reading JPG images and creating previews...</ToolInfoBox>
      )}

      {images.length > 0 ? (
        <>
          <ToolResultBox title="PDF settings">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  Page format
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
                  <option value="contain">Contain full image</option>
                  <option value="cover">Fill page</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">Margin</span>

                <select
                  value={margin}
                  onChange={(event) => {
                    revokePdfUrl();
                    setMargin(event.target.value as MarginSize);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="none">None</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                </select>
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
                  onChange={(event) => {
                    revokePdfUrl();
                    setJpegQuality(parseFloat(event.target.value));
                  }}
                  className="mt-5 w-full"
                />

                <p className="mt-2 text-xs leading-5 text-black/50">
                  Higher quality may create a larger PDF.
                </p>
              </label>
            </div>
          </ToolResultBox>

          <ToolResultBox title="JPG page order">
            <div className="mb-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              The PDF page order follows the image list below. Move images up or
              down before creating your PDF.
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={sortImagesByName}
                disabled={images.length < 2 || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Sort A-Z
              </button>

              <button
                type="button"
                onClick={reverseImageOrder}
                disabled={images.length < 2 || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Reverse order
              </button>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isReadingImages || isGenerating}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Add more images
              </button>
            </div>

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

                  <div className="mt-4 min-w-0">
                    <div className="truncate text-sm font-bold text-black">
                      Page {index + 1}: {image.file.name}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {image.width} × {image.height} •{" "}
                      {formatFileSize(image.file.size)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "up")}
                      disabled={index === 0 || isGenerating}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "down")}
                      disabled={index === images.length - 1 || isGenerating}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
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
              <StatCard label="Pages" value={String(images.length)} highlight />

              <StatCard
                label="Upload size"
                value={formatFileSize(totalUploadSize)}
              />

              <StatCard
                label="Avg. image size"
                value={formatFileSize(averageImageSize)}
              />
            </div>
          </ToolResultBox>
        </>
      ) : (
        <ToolInfoBox>
          Add one or more JPG images to create a PDF. You can reorder images,
          adjust page settings and download the finished PDF instantly.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={generatePdf}
          disabled={!images.length || isGenerating || isReadingImages}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGenerating ? "Creating PDF..." : "Create PDF"}
        </button>

        {pdfUrl && (
          <button
            type="button"
            onClick={downloadAgain}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download again
          </button>
        )}

        <button
          type="button"
          onClick={clearImages}
          disabled={!images.length || isGenerating || isReadingImages}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear images
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

      {pdfUrl && (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-black">PDF ready</h3>

          <p className="mt-3 text-sm leading-7 text-black/60">
            Your JPG images have been converted into a PDF and downloaded. You
            can download it again without reprocessing the images.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Output file" value={safePdfName} highlight />

            <StatCard
              label="Output size"
              value={pdfSize !== null ? formatFileSize(pdfSize) : "Ready"}
            />

            <StatCard label="PDF pages" value={String(images.length)} />
          </div>
        </div>
      )}

      <ToolInfoBox>
        All processing happens locally in your browser. Your JPG images are not
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