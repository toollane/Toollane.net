"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type OutputFormat = "jpeg" | "png" | "webp";

type SelectedImage = {
  file: File;
  previewUrl: string;
  dataUrl: string;
  width: number;
  height: number;
};

type ResizedImage = {
  url: string;
  size: number;
  width: number;
  height: number;
  format: OutputFormat;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function createSafeBaseName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "resized-image"
  );
}

function getMimeType(format: OutputFormat) {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";

  return "image/jpeg";
}

function getFileExtension(format: OutputFormat) {
  if (format === "png") return "png";
  if (format === "webp") return "webp";

  return "jpg";
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

function parseDimension(value: string) {
  const normalized = value.replace(",", ".").trim();

  if (!normalized) return null;

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) return null;

  return Math.round(parsed);
}

function readImageFile(file: File) {
  return new Promise<SelectedImage>((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const image = new Image();

      image.onload = () => {
        resolve({
          file,
          previewUrl,
          dataUrl,
          width: image.width,
          height: image.height,
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        reject(new Error("Image could not be loaded."));
      };

      image.src = dataUrl;
    };

    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("Image could not be read."));
    };

    reader.readAsDataURL(file);
  });
}

export default function ImageResizerClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectedImageRef = useRef<SelectedImage | null>(null);
  const resizedImageRef = useRef<ResizedImage | null>(null);

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [fileName, setFileName] = useState("resized-image");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("800");
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [quality, setQuality] = useState(0.9);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [resizedImage, setResizedImage] = useState<ResizedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const widthNumber = parseDimension(width);
  const heightNumber = parseDimension(height);
  const safeOutputName = createSafeBaseName(fileName);

  const scalePercent = useMemo(() => {
    if (!selectedImage || !widthNumber || selectedImage.width <= 0) {
      return null;
    }

    return (widthNumber / selectedImage.width) * 100;
  }, [selectedImage, widthNumber]);

  const savedPercent =
    selectedImage && resizedImage && selectedImage.file.size > 0
      ? Math.max(
          0,
          ((selectedImage.file.size - resizedImage.size) /
            selectedImage.file.size) *
            100
        )
      : null;

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    resizedImageRef.current = resizedImage;
  }, [resizedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageRef.current) {
        URL.revokeObjectURL(selectedImageRef.current.previewUrl);
      }

      if (resizedImageRef.current) {
        URL.revokeObjectURL(resizedImageRef.current.url);
      }
    };
  }, []);

  function revokeResizedImage() {
    if (resizedImage) {
      URL.revokeObjectURL(resizedImage.url);
      setResizedImage(null);
    }
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeResizedImage();

    const file = Array.from(selectedFiles)[0];

    if (!file) return;

    if (!isSupportedImage(file)) {
      setError("Please upload a valid image file.");
      return;
    }

    setReadingImage(true);

    try {
      const nextImage = await readImageFile(file);

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }

      setSelectedImage(nextImage);
      setFileName(`${createSafeBaseName(file.name)}-resized`);
      setWidth(String(nextImage.width));
      setHeight(String(nextImage.height));
      setError("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError("Could not read this image. Please try another image file.");
      setSelectedImage(null);
    } finally {
      setReadingImage(false);
    }
  }

  function updateWidth(nextWidth: string) {
    revokeResizedImage();
    setWidth(nextWidth);

    const parsedWidth = parseDimension(nextWidth);

    if (
      lockAspectRatio &&
      parsedWidth &&
      selectedImage &&
      selectedImage.width > 0
    ) {
      setHeight(
        String(Math.max(1, Math.round(parsedWidth * (selectedImage.height / selectedImage.width))))
      );
    }
  }

  function updateHeight(nextHeight: string) {
    revokeResizedImage();
    setHeight(nextHeight);

    const parsedHeight = parseDimension(nextHeight);

    if (
      lockAspectRatio &&
      parsedHeight &&
      selectedImage &&
      selectedImage.height > 0
    ) {
      setWidth(
        String(Math.max(1, Math.round(parsedHeight * (selectedImage.width / selectedImage.height))))
      );
    }
  }

  function applyScale(scale: number) {
    if (!selectedImage) return;

    revokeResizedImage();

    setWidth(String(Math.max(1, Math.round(selectedImage.width * scale))));
    setHeight(String(Math.max(1, Math.round(selectedImage.height * scale))));
  }

  function applyWidthPreset(nextWidth: number) {
    if (!selectedImage) return;

    revokeResizedImage();

    setWidth(String(nextWidth));

    if (lockAspectRatio) {
      setHeight(
        String(Math.max(1, Math.round(nextWidth * (selectedImage.height / selectedImage.width))))
      );
    }
  }

  function restoreOriginalSize() {
    if (!selectedImage) return;

    revokeResizedImage();

    setWidth(String(selectedImage.width));
    setHeight(String(selectedImage.height));
  }

  function swapDimensions() {
    revokeResizedImage();

    setWidth(height);
    setHeight(width);
  }

  function clearImage() {
    revokeResizedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("resized-image");
    setWidth("1200");
    setHeight("800");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokeResizedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("resized-image");
    setWidth("1200");
    setHeight("800");
    setLockAspectRatio(true);
    setQuality(0.9);
    setFormat("jpeg");
    setLoading(false);
    setReadingImage(false);
    setDragActive(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function resizeImage() {
    setError("");
    revokeResizedImage();

    if (!selectedImage) {
      setError("Upload an image first.");
      return;
    }

    if (!widthNumber || !heightNumber || widthNumber <= 0 || heightNumber <= 0) {
      setError("Width and height must be greater than zero.");
      return;
    }

    if (widthNumber > 12000 || heightNumber > 12000) {
      setError("Width and height must be 12,000 px or lower.");
      return;
    }

    setLoading(true);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();

        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Image could not be loaded."));
        element.src = selectedImage.dataUrl;
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = widthNumber;
      canvas.height = heightNumber;

      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, widthNumber, heightNumber);
      } else {
        context.clearRect(0, 0, widthNumber, heightNumber);
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, widthNumber, heightNumber);

      const mimeType = getMimeType(format);

      const blob = await new Promise<Blob | null>((resolve) => {
        if (format === "png") {
          canvas.toBlob(resolve, mimeType);
        } else {
          canvas.toBlob(resolve, mimeType, quality);
        }
      });

      if (!blob) {
        throw new Error("Could not create resized image.");
      }

      setResizedImage({
        url: URL.createObjectURL(blob),
        size: blob.size,
        width: widthNumber,
        height: heightNumber,
        format,
      });
    } catch {
      setError("Something went wrong while resizing the image.");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!resizedImage) return;

    const extension = getFileExtension(resizedImage.format);
    const link = document.createElement("a");

    link.href = resizedImage.url;
    link.download = `${safeOutputName}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Resize images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Resize images in your browser with aspect-ratio lock, output format
          selection, quality control and instant preview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Selected image"
          value={selectedImage ? "1 image" : "0 images"}
          highlight={Boolean(selectedImage)}
        />

        <StatCard
          label="Original size"
          value={selectedImage ? formatFileSize(selectedImage.file.size) : "0 KB"}
        />

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
          accept="image/*,.jpg,.jpeg,.png,.webp"
          onChange={(event) => {
            if (event.target.files) {
              void handleFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          IMG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">Drop an image here</h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          PNG, JPG, WEBP and other browser-supported images. Your file stays in
          your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={readingImage || loading}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {readingImage ? "Reading image..." : "Choose image"}
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {readingImage && (
        <ToolInfoBox>Reading image and creating preview...</ToolInfoBox>
      )}

      {selectedImage ? (
        <>
          <ToolResultBox title="Resize settings">
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="rounded-[2rem] border border-black/10 bg-white p-4">
                <img
                  src={selectedImage.previewUrl}
                  alt={selectedImage.file.name}
                  className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-contain"
                />

                <div className="mt-4 min-w-0">
                  <div className="truncate text-sm font-bold text-black">
                    {selectedImage.file.name}
                  </div>

                  <div className="mt-1 text-xs text-black/50">
                    {selectedImage.width} × {selectedImage.height} •{" "}
                    {formatFileSize(selectedImage.file.size)}
                  </div>
                </div>
              </div>

              <div className="grid content-start gap-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <NumberInput label="Width" value={width} onChange={updateWidth} />

                  <NumberInput
                    label="Height"
                    value={height}
                    onChange={updateHeight}
                  />

                  <label className="block">
                    <span className="text-sm font-bold text-black">
                      Output format
                    </span>

                    <select
                      value={format}
                      onChange={(event) => {
                        revokeResizedImage();
                        setFormat(event.target.value as OutputFormat);
                      }}
                      className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                    >
                      <option value="jpeg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WEBP</option>
                    </select>
                  </label>
                </div>

                <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
                  <span className="text-sm font-bold text-black">
                    Lock aspect ratio
                  </span>

                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(event) => {
                      revokeResizedImage();
                      setLockAspectRatio(event.target.checked);
                    }}
                    className="h-5 w-5 accent-black"
                  />
                </label>

                <label className="block rounded-2xl border border-black/10 bg-white p-5">
                  <span className="text-sm font-bold text-black">
                    Quality: {Math.round(quality * 100)}%
                  </span>

                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(event) => {
                      revokeResizedImage();
                      setQuality(Number(event.target.value));
                    }}
                    disabled={format === "png"}
                    className="mt-5 w-full accent-black disabled:opacity-40"
                  />

                  <p className="mt-2 text-xs leading-5 text-black/50">
                    JPG and WEBP support quality compression. PNG keeps lossless
                    image data.
                  </p>
                </label>

                <div>
                  <div className="mb-3 text-sm font-bold text-black">
                    Quick resize presets
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={restoreOriginalSize}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Original
                    </button>

                    <button
                      type="button"
                      onClick={() => applyScale(0.75)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      75%
                    </button>

                    <button
                      type="button"
                      onClick={() => applyScale(0.5)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      50%
                    </button>

                    <button
                      type="button"
                      onClick={() => applyScale(0.25)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      25%
                    </button>

                    <button
                      type="button"
                      onClick={() => applyWidthPreset(800)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      800 px wide
                    </button>

                    <button
                      type="button"
                      onClick={() => applyWidthPreset(1200)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      1200 px wide
                    </button>

                    <button
                      type="button"
                      onClick={() => applyWidthPreset(1920)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      1920 px wide
                    </button>

                    <button
                      type="button"
                      onClick={swapDimensions}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Swap W/H
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Resize summary">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Original"
                value={`${selectedImage.width} × ${selectedImage.height}`}
              />

              <StatCard
                label="New size"
                value={
                  widthNumber && heightNumber
                    ? `${widthNumber} × ${heightNumber}`
                    : "Invalid size"
                }
                highlight={Boolean(widthNumber && heightNumber)}
              />

              <StatCard
                label="Scale"
                value={scalePercent !== null ? `${scalePercent.toFixed(1)}%` : "—"}
              />
            </div>
          </ToolResultBox>
        </>
      ) : (
        !readingImage && (
          <ToolInfoBox>
            Upload an image to resize it. This is useful for websites, social
            media, email attachments, online forms and web optimization.
          </ToolInfoBox>
        )
      )}

      {resizedImage && (
        <ToolResultBox title="Resized image ready">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-4">
              <img
                src={resizedImage.url}
                alt="Resized preview"
                className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-contain"
              />

              <button
                type="button"
                onClick={downloadImage}
                className="mt-4 w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Download resized image
              </button>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Output size"
                  value={formatFileSize(resizedImage.size)}
                  highlight
                />

                <StatCard
                  label="Dimensions"
                  value={`${resizedImage.width} × ${resizedImage.height}`}
                />

                <StatCard
                  label="Format"
                  value={resizedImage.format.toUpperCase()}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Original file"
                  value={
                    selectedImage
                      ? formatFileSize(selectedImage.file.size)
                      : "Unknown"
                  }
                />

                <StatCard
                  label="Saved"
                  value={
                    savedPercent !== null ? `${savedPercent.toFixed(1)}%` : "0%"
                  }
                />

                <StatCard label="Output file" value={safeOutputName} />
              </div>
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={resizeImage}
          disabled={!selectedImage || loading || readingImage}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Resizing image..." : "Resize image"}
        </button>

        {resizedImage && (
          <button
            type="button"
            onClick={downloadImage}
            className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
          >
            Download again
          </button>
        )}

        <button
          type="button"
          onClick={clearImage}
          disabled={!selectedImage || loading || readingImage}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear image
        </button>

        <button
          type="button"
          onClick={resetTool}
          disabled={loading || readingImage}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Resizing happens locally in your browser. Use JPG for smaller photos,
        PNG for transparency and WEBP for modern web optimization.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <div className="mt-3 flex overflow-hidden rounded-2xl border border-black/10 bg-white transition focus-within:border-black">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none"
        />

        <div className="flex items-center border-l border-black/10 px-4 text-sm font-bold text-black/50">
          px
        </div>
      </div>
    </label>
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