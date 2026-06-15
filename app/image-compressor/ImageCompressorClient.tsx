"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type OutputFormat = "jpeg" | "webp" | "png";
type ResizeMode = "keep" | "width";

type CompressedImage = {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  width: number;
  height: number;
  format: OutputFormat;
};

type SelectedImage = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
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
      .replace(/^-|-$/g, "") || "compressed-image"
  );
}

function getMimeType(format: OutputFormat) {
  if (format === "webp") return "image/webp";
  if (format === "png") return "image/png";

  return "image/jpeg";
}

function getFileExtension(format: OutputFormat) {
  if (format === "webp") return "webp";
  if (format === "png") return "png";

  return "jpg";
}

function isSupportedImage(file: File) {
  const name = file.name.toLowerCase();

  return (
    file.type === "image/jpeg" ||
    file.type === "image/pjpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".webp")
  );
}

function readImage(file: File) {
  return new Promise<SelectedImage>((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        file,
        previewUrl,
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("Image could not be loaded."));
    };

    image.src = previewUrl;
  });
}

export default function ImageCompressorClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectedImageRef = useRef<SelectedImage | null>(null);
  const compressedImageRef = useRef<CompressedImage | null>(null);

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [resizeMode, setResizeMode] = useState<ResizeMode>("width");
  const [maxWidth, setMaxWidth] = useState("1600");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [compressedImage, setCompressedImage] =
    useState<CompressedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const savedPercent =
    compressedImage && compressedImage.originalSize > 0
      ? Math.max(
          0,
          ((compressedImage.originalSize - compressedImage.compressedSize) /
            compressedImage.originalSize) *
            100
        )
      : null;

  const sizeChange = useMemo(() => {
    if (!compressedImage || compressedImage.originalSize <= 0) {
      return null;
    }

    const difference =
      compressedImage.originalSize - compressedImage.compressedSize;

    return {
      bytes: difference,
      isSmaller: difference >= 0,
    };
  }, [compressedImage]);

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    compressedImageRef.current = compressedImage;
  }, [compressedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageRef.current) {
        URL.revokeObjectURL(selectedImageRef.current.previewUrl);
      }

      if (compressedImageRef.current) {
        URL.revokeObjectURL(compressedImageRef.current.url);
      }
    };
  }, []);

  function revokeCompressedImage() {
    if (compressedImage) {
      URL.revokeObjectURL(compressedImage.url);
      setCompressedImage(null);
    }
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeCompressedImage();

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) return;

    if (!isSupportedImage(selectedFile)) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    setReadingImage(true);

    try {
      const nextImage = await readImage(selectedFile);

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }

      setSelectedImage(nextImage);

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

  function clearImage() {
    revokeCompressedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokeCompressedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setQuality(0.75);
    setResizeMode("width");
    setMaxWidth("1600");
    setOutputFormat("jpeg");
    setLoading(false);
    setReadingImage(false);
    setDragActive(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function compressImage() {
    setError("");
    revokeCompressedImage();

    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    const parsedMaxWidth = Number(maxWidth.replace(",", ".").trim());

    if (
      resizeMode === "width" &&
      (!Number.isFinite(parsedMaxWidth) || parsedMaxWidth <= 0)
    ) {
      setError("Please enter a valid maximum width.");
      return;
    }

    setLoading(true);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();

        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Image could not be loaded."));
        element.src = selectedImage.previewUrl;
      });

      const shouldResize =
        resizeMode === "width" && parsedMaxWidth < image.width;

      const scale = shouldResize ? parsedMaxWidth / image.width : 1;
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = width;
      canvas.height = height;

      if (outputFormat === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }

      context.drawImage(image, 0, 0, width, height);

      const mimeType = getMimeType(outputFormat);

      const blob = await new Promise<Blob | null>((resolve) => {
        if (outputFormat === "png") {
          canvas.toBlob(resolve, mimeType);
        } else {
          canvas.toBlob(resolve, mimeType, quality);
        }
      });

      if (!blob) {
        throw new Error("Could not compress image.");
      }

      const url = URL.createObjectURL(blob);

      setCompressedImage({
        originalName: selectedImage.file.name,
        originalSize: selectedImage.file.size,
        compressedSize: blob.size,
        url,
        width,
        height,
        format: outputFormat,
      });
    } catch {
      setError(
        "Something went wrong while compressing the image. Please try another file."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!compressedImage) return;

    const baseName = createSafeBaseName(compressedImage.originalName);
    const extension = getFileExtension(compressedImage.format);
    const link = document.createElement("a");

    link.href = compressedImage.url;
    link.download = `${baseName}-compressed.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compress images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Reduce JPG, PNG or WEBP image size directly in your browser. Adjust
          quality, output format and maximum width before downloading the
          optimized image.
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
          value={
            selectedImage ? formatFileSize(selectedImage.file.size) : "0 KB"
          }
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
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
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

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop an image here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Choose a JPG, PNG or WEBP image. Your image stays in your browser.
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
        <ToolResultBox title="Selected image">
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
                <StatCard
                  label="Original"
                  value={formatFileSize(selectedImage.file.size)}
                />

                <StatCard
                  label="Dimensions"
                  value={`${selectedImage.width} × ${selectedImage.height}`}
                />

                <StatCard
                  label="File type"
                  value={
                    selectedImage.file.type
                      ? selectedImage.file.type.replace("image/", "").toUpperCase()
                      : "Image"
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-bold text-black">
                    Output format
                  </span>

                  <select
                    value={outputFormat}
                    onChange={(event) => {
                      revokeCompressedImage();
                      setOutputFormat(event.target.value as OutputFormat);
                    }}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                  >
                    <option value="jpeg">JPG</option>
                    <option value="webp">WEBP</option>
                    <option value="png">PNG</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-black">
                    Resize mode
                  </span>

                  <select
                    value={resizeMode}
                    onChange={(event) => {
                      revokeCompressedImage();
                      setResizeMode(event.target.value as ResizeMode);
                    }}
                    className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                  >
                    <option value="width">Limit max width</option>
                    <option value="keep">Keep original size</option>
                  </select>
                </label>

                <TextNumberInput
                  label="Max width"
                  value={maxWidth}
                  onChange={(value) => {
                    revokeCompressedImage();
                    setMaxWidth(value);
                  }}
                  suffix="px"
                  disabled={resizeMode === "keep"}
                />
              </div>

              <label className="block rounded-2xl border border-black/10 bg-white p-5">
                <span className="text-sm font-bold text-black">
                  Quality: {Math.round(quality * 100)}%
                </span>

                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(event) => {
                    revokeCompressedImage();
                    setQuality(Number(event.target.value));
                  }}
                  disabled={outputFormat === "png"}
                  className="mt-4 w-full accent-black disabled:opacity-40"
                />

                <p className="mt-2 text-xs leading-5 text-black/50">
                  JPG and WEBP support quality compression. PNG output keeps
                  lossless image data and may not reduce size as much.
                </p>
              </label>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        !readingImage && (
          <ToolInfoBox>
            Upload an image to reduce file size. This is useful for websites,
            forms, email attachments and online applications.
          </ToolInfoBox>
        )
      )}

      {compressedImage && (
        <ToolResultBox title="Compressed image">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-4">
              <img
                src={compressedImage.url}
                alt="Compressed preview"
                className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-contain"
              />

              <button
                type="button"
                onClick={downloadImage}
                className="mt-4 w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Download compressed image
              </button>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Original"
                  value={formatFileSize(compressedImage.originalSize)}
                />

                <StatCard
                  label="Compressed"
                  value={formatFileSize(compressedImage.compressedSize)}
                  highlight
                />

                <StatCard
                  label="Saved"
                  value={
                    savedPercent !== null ? `${savedPercent.toFixed(1)}%` : "0%"
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Output format"
                  value={compressedImage.format.toUpperCase()}
                />

                <StatCard
                  label="Output dimensions"
                  value={`${compressedImage.width} × ${compressedImage.height}`}
                />

                <StatCard
                  label={sizeChange?.isSmaller ? "Reduced by" : "Increased by"}
                  value={
                    sizeChange
                      ? formatFileSize(Math.abs(sizeChange.bytes))
                      : "0 KB"
                  }
                />
              </div>

              {sizeChange && !sizeChange.isSmaller && (
                <ToolInfoBox>
                  This output is larger than the original. Try JPG or WEBP
                  output, lower quality or a smaller maximum width for stronger
                  compression.
                </ToolInfoBox>
              )}
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={compressImage}
          disabled={!selectedImage || loading || readingImage}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Compressing image..." : "Compress image"}
        </button>

        {compressedImage && (
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
        Image compression happens locally in your browser. Your JPG, PNG or WEBP
        file is not uploaded to Toollane servers.
      </ToolInfoBox>
    </div>
  );
}

function TextNumberInput({
  label,
  value,
  onChange,
  suffix,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  disabled?: boolean;
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
          disabled={disabled}
          className="min-w-0 flex-1 px-4 py-4 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
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