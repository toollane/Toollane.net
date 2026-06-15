"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type PdfPageSize = "fit" | "a4" | "letter";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";
type MarginSize = "none" | "small" | "medium";
type ImageKind = "jpg" | "png";

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  kind: ImageKind;
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

  return `${cleaned || "images-to-pdf"}.pdf`;
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
  if (margin === "small") return 24;

  return 48;
}

function getStandardPageSize(
  pageSize: Exclude<PdfPageSize, "fit">,
  orientation: Orientation
) {
  const sizes = {
    a4: {
      width: 595.28,
      height: 841.89,
    },
    letter: {
      width: 612,
      height: 792,
    },
  };

  const size = sizes[pageSize];

  if (orientation === "landscape") {
    return {
      width: size.height,
      height: size.width,
    };
  }

  return size;
}

function getImageKind(file: File): ImageKind | null {
  const name = file.name.toLowerCase();

  if (
    file.type === "image/png" ||
    name.endsWith(".png")
  ) {
    return "png";
  }

  if (
    file.type === "image/jpeg" ||
    file.type === "image/pjpeg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return "jpg";
  }

  return null;
}

function readImageFile(file: File) {
  return new Promise<UploadedImage>((resolve, reject) => {
    const kind = getImageKind(file);

    if (!kind) {
      reject(new Error("Unsupported image file."));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        id: createImageId(file),
        file,
        previewUrl,
        width: image.width,
        height: image.height,
        kind,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("Invalid image file."));
    };

    image.src = previewUrl;
  });
}

export default function ImageToPdfClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const pdfUrlRef = useRef("");

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [fileName, setFileName] = useState("images-to-pdf.pdf");
  const [pageSize, setPageSize] = useState<PdfPageSize>("fit");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [margin, setMargin] = useState<MarginSize>("small");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingImages, setReadingImages] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const totalUploadSize = useMemo(
    () => images.reduce((sum, image) => sum + image.file.size, 0),
    [images]
  );

  const safePdfName = createSafeFileName(fileName);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));

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

  function clearImagePreviews(items: UploadedImage[]) {
    items.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }

  async function addImages(selectedFiles: FileList | File[]) {
    setError("");
    revokePdfUrl();

    const incomingFiles = Array.from(selectedFiles);

    const imageFiles = incomingFiles.filter((file) => Boolean(getImageKind(file)));

    if (!imageFiles.length) {
      setError("Please select valid JPG, JPEG or PNG image files.");
      return;
    }

    setReadingImages(true);

    try {
      const processedImages = await Promise.all(imageFiles.map(readImageFile));

      setImages((current) => {
        const existingKeys = new Set(
          current.map((image) => `${image.file.name}-${image.file.size}`)
        );

        const newImages = processedImages.filter(
          (image) => !existingKeys.has(`${image.file.name}-${image.file.size}`)
        );

        const duplicates = processedImages.filter((image) =>
          existingKeys.has(`${image.file.name}-${image.file.size}`)
        );

        clearImagePreviews(duplicates);

        if (!newImages.length) {
          setError("These images are already in the list.");
          return current;
        }

        return [...current, ...newImages];
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError(
        "Something went wrong while reading the images. Please try again with valid JPG, JPEG or PNG files."
      );
    } finally {
      setReadingImages(false);
    }
  }

  function removeImage(id: string) {
    revokePdfUrl();

    setImages((current) => {
      const item = current.find((image) => image.id === id);

      if (item) {
        URL.revokeObjectURL(item.previewUrl);
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
    setFileName("images-to-pdf.pdf");
    setPageSize("fit");
    setOrientation("portrait");
    setFitMode("contain");
    setMargin("small");
    setLoading(false);
    setReadingImages(false);
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

  function sortImagesByName() {
    revokePdfUrl();

    setImages((current) =>
      [...current].sort((a, b) => a.file.name.localeCompare(b.file.name))
    );
  }

  function reverseImageOrder() {
    revokePdfUrl();
    setImages((current) => [...current].reverse());
  }

  async function createPdf() {
    setError("");
    revokePdfUrl();

    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);

    try {
      const pdf = await PDFDocument.create();
      const marginValue = getMarginValue(margin);

      for (const image of images) {
        const bytes = await image.file.arrayBuffer();

        const embeddedImage =
          image.kind === "png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);

        const originalWidth = embeddedImage.width;
        const originalHeight = embeddedImage.height;

        if (pageSize === "fit") {
          const pageWidth = originalWidth + marginValue * 2;
          const pageHeight = originalHeight + marginValue * 2;

          const page = pdf.addPage([pageWidth, pageHeight]);

          page.drawImage(embeddedImage, {
            x: marginValue,
            y: marginValue,
            width: originalWidth,
            height: originalHeight,
          });
        } else {
          const standardSize = getStandardPageSize(pageSize, orientation);
          const page = pdf.addPage([standardSize.width, standardSize.height]);

          const usableWidth = standardSize.width - marginValue * 2;
          const usableHeight = standardSize.height - marginValue * 2;

          const imageRatio = originalWidth / originalHeight;
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

          page.drawImage(embeddedImage, {
            x: (standardSize.width - drawWidth) / 2,
            y: (standardSize.height - drawHeight) / 2,
            width: drawWidth,
            height: drawHeight,
          });
        }
      }

      const pdfBytes = await pdf.save();
      const pdfArrayBuffer = new ArrayBuffer(pdfBytes.length);
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);

      pdfUint8Array.set(pdfBytes);

      const blob = new Blob([pdfArrayBuffer], {
        type: "application/pdf",
      });

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
        "Something went wrong while creating the PDF. Please make sure your images are valid JPG, JPEG or PNG files."
      );
    } finally {
      setLoading(false);
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
          Convert images to PDF online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload JPG or PNG images, arrange the page order and create a single
          PDF directly in your browser.
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
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              void addImages(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          IMG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop images here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Add one or more JPG, JPEG or PNG images. Files stay in your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={readingImages || loading}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {readingImages ? "Reading images..." : "Choose images"}
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

      {readingImages && (
        <ToolInfoBox>Reading image files and creating previews...</ToolInfoBox>
      )}

      {images.length > 0 ? (
        <>
          <ToolResultBox title="PDF settings">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="text-sm font-bold text-black">Page size</span>

                <select
                  value={pageSize}
                  onChange={(event) => {
                    revokePdfUrl();
                    setPageSize(event.target.value as PdfPageSize);
                  }}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value="fit">Fit page to each image</option>
                  <option value="a4">A4 page</option>
                  <option value="letter">US Letter page</option>
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
                  disabled={pageSize === "fit"}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
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
                  disabled={pageSize === "fit"}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>
          </ToolResultBox>

          <ToolResultBox title="Image page order">
            <div className="mb-5 rounded-2xl border border-black/10 bg-[#fff8df] p-5 text-sm leading-7 text-black/65">
              The PDF page order follows the image list below. Move images up or
              down before creating your PDF.
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={sortImagesByName}
                disabled={images.length < 2 || loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Sort A-Z
              </button>

              <button
                type="button"
                onClick={reverseImageOrder}
                disabled={images.length < 2 || loading}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5 disabled:opacity-40"
              >
                Reverse order
              </button>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={readingImages || loading}
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
                    src={image.previewUrl}
                    alt={image.file.name}
                    className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-cover"
                  />

                  <div className="mt-4 min-w-0">
                    <div className="truncate text-sm font-bold text-black">
                      Page {index + 1}: {image.file.name}
                    </div>

                    <div className="mt-1 text-xs text-black/50">
                      {image.width} × {image.height} •{" "}
                      {formatFileSize(image.file.size)} •{" "}
                      {image.kind.toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "up")}
                      disabled={index === 0 || loading}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                    >
                      Up
                    </button>

                    <button
                      type="button"
                      onClick={() => moveImage(image.id, "down")}
                      disabled={index === images.length - 1 || loading}
                      className="rounded-xl border border-black/10 px-3 py-2 text-xs font-bold transition hover:border-black disabled:opacity-40"
                    >
                      Down
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={loading}
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
              <StatCard label="PDF pages" value={String(images.length)} highlight />

              <StatCard
                label="Upload size"
                value={formatFileSize(totalUploadSize)}
              />

              <StatCard
                label="Page mode"
                value={pageSize === "fit" ? "Fit to image" : pageSize.toUpperCase()}
              />
            </div>
          </ToolResultBox>
        </>
      ) : (
        <ToolInfoBox>
          Add one or more images to create a PDF. You can reorder images, adjust
          page settings and download the finished file instantly.
        </ToolInfoBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={createPdf}
          disabled={!images.length || loading || readingImages}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Creating PDF..." : "Create PDF"}
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
          disabled={!images.length || loading || readingImages}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear images
        </button>

        <button
          type="button"
          onClick={resetTool}
          disabled={loading || readingImages}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {pdfUrl && (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-black text-black">PDF ready</h3>

          <p className="mt-3 text-sm leading-7 text-black/60">
            Your images have been converted into a PDF and downloaded. You can
            download it again without reprocessing the images.
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
        All processing happens locally in your browser. Your images are not
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