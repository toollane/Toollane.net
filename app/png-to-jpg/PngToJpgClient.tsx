"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type SelectedImage = {
  file: File;
  previewUrl: string;
  dataUrl: string;
  width: number;
  height: number;
};

type ConvertedImage = {
  url: string;
  originalName: string;
  originalSize: number;
  convertedSize: number;
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
      .replace(/^-|-$/g, "") || "converted-image"
  );
}

function isPngImage(file: File) {
  return file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
}

function readPngFile(file: File) {
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
        reject(new Error("PNG image could not be loaded."));
      };

      image.src = dataUrl;
    };

    reader.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("PNG image could not be read."));
    };

    reader.readAsDataURL(file);
  });
}

export default function PngToJpgClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectedImageRef = useRef<SelectedImage | null>(null);
  const convertedImageRef = useRef<ConvertedImage | null>(null);

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [fileName, setFileName] = useState("converted-image");
  const [quality, setQuality] = useState(0.92);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [convertedImage, setConvertedImage] =
    useState<ConvertedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const safeOutputName = createSafeBaseName(fileName);

  const savedPercent = useMemo(() => {
    if (!convertedImage || convertedImage.originalSize <= 0) {
      return null;
    }

    return Math.max(
      0,
      ((convertedImage.originalSize - convertedImage.convertedSize) /
        convertedImage.originalSize) *
        100
    );
  }, [convertedImage]);

  const sizeDifference = useMemo(() => {
    if (!convertedImage) return null;

    return convertedImage.originalSize - convertedImage.convertedSize;
  }, [convertedImage]);

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    convertedImageRef.current = convertedImage;
  }, [convertedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageRef.current) {
        URL.revokeObjectURL(selectedImageRef.current.previewUrl);
      }

      if (convertedImageRef.current) {
        URL.revokeObjectURL(convertedImageRef.current.url);
      }
    };
  }, []);

  function revokeConvertedImage() {
    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
      setConvertedImage(null);
    }
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeConvertedImage();

    const file = Array.from(selectedFiles)[0];

    if (!file) return;

    if (!isPngImage(file)) {
      setError("Please select a valid PNG image.");
      setSelectedImage(null);
      return;
    }

    setReadingImage(true);

    try {
      const nextImage = await readPngFile(file);

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }

      setSelectedImage(nextImage);
      setFileName(`${createSafeBaseName(file.name)}-jpg`);
      setError("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      setError("Could not read this PNG image. Please try another PNG file.");
      setSelectedImage(null);
    } finally {
      setReadingImage(false);
    }
  }

  function clearImage() {
    revokeConvertedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("converted-image");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokeConvertedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("converted-image");
    setQuality(0.92);
    setBackgroundColor("#ffffff");
    setLoading(false);
    setReadingImage(false);
    setDragActive(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertImage() {
    setError("");
    revokeConvertedImage();

    if (!selectedImage) {
      setError("Please select a PNG image first.");
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

      canvas.width = image.width;
      canvas.height = image.height;

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", quality);
      });

      if (!blob) {
        throw new Error("Could not create JPG image.");
      }

      const url = URL.createObjectURL(blob);

      setConvertedImage({
        url,
        originalName: selectedImage.file.name,
        originalSize: selectedImage.file.size,
        convertedSize: blob.size,
        width: canvas.width,
        height: canvas.height,
      });
    } catch {
      setError(
        "Something went wrong while converting the PNG image. Please try another file."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!convertedImage) return;

    const link = document.createElement("a");

    link.href = convertedImage.url;
    link.download = `${safeOutputName}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert PNG to JPG online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PNG image and convert it to JPG directly in your browser.
          Choose quality and a background color for transparent areas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Selected image"
          value={selectedImage ? "1 PNG" : "0 images"}
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
          accept="image/png,.png"
          onChange={(event) => {
            if (event.target.files) {
              void handleFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          PNG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop a PNG image here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Choose one PNG image to convert to JPG. Your image stays in your
          browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={readingImage || loading}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {readingImage ? "Reading PNG..." : "Choose PNG image"}
        </button>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">Output file name</span>

        <input
          type="text"
          value={fileName}
          onChange={(event) => {
            revokeConvertedImage();
            setFileName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          The file will be saved as {safeOutputName}.jpg.
        </p>
      </label>

      {error && <ToolErrorBox message={error} />}

      {readingImage && (
        <ToolInfoBox>Reading PNG image and creating preview...</ToolInfoBox>
      )}

      {selectedImage ? (
        <ToolResultBox title="Selected PNG">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-4">
              <div className="rounded-[1.5rem] border border-black/10 bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-3">
                <img
                  src={selectedImage.previewUrl}
                  alt={selectedImage.file.name}
                  className="aspect-square w-full rounded-xl object-contain"
                />
              </div>

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

                <StatCard label="Output" value="JPG" highlight />
              </div>

              <label className="block rounded-2xl border border-black/10 bg-white p-5">
                <span className="text-sm font-bold text-black">
                  JPG quality: {Math.round(quality * 100)}%
                </span>

                <input
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(event) => {
                    revokeConvertedImage();
                    setQuality(Number(event.target.value));
                  }}
                  className="mt-4 w-full accent-black"
                />

                <p className="mt-2 text-xs leading-5 text-black/50">
                  Higher quality keeps more detail but may create a larger JPG
                  file.
                </p>
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="text-sm font-bold text-black">
                    Background color for transparent areas
                  </span>

                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => {
                      revokeConvertedImage();
                      setBackgroundColor(event.target.value);
                    }}
                    className="mt-3 h-14 w-full rounded-2xl border border-black/10 bg-white p-2"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      revokeConvertedImage();
                      setBackgroundColor("#ffffff");
                    }}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                  >
                    White
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      revokeConvertedImage();
                      setBackgroundColor("#000000");
                    }}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                  >
                    Black
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      revokeConvertedImage();
                      setBackgroundColor("#fff8df");
                    }}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                  >
                    Warm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        !readingImage && (
          <ToolInfoBox>
            Upload a PNG image to convert it into JPG. Transparent areas will be
            filled with your selected background color.
          </ToolInfoBox>
        )
      )}

      {convertedImage && (
        <ToolResultBox title="Converted JPG ready">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-4">
              <img
                src={convertedImage.url}
                alt="Converted JPG result"
                className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-contain"
              />

              <button
                type="button"
                onClick={downloadImage}
                className="mt-4 w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Download JPG
              </button>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Original"
                  value={formatFileSize(convertedImage.originalSize)}
                />

                <StatCard
                  label="JPG file"
                  value={formatFileSize(convertedImage.convertedSize)}
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
                  label={
                    sizeDifference !== null && sizeDifference >= 0
                      ? "Reduced by"
                      : "Increased by"
                  }
                  value={
                    sizeDifference !== null
                      ? formatFileSize(Math.abs(sizeDifference))
                      : "0 KB"
                  }
                />

                <StatCard
                  label="Dimensions"
                  value={`${convertedImage.width} × ${convertedImage.height}`}
                />

                <StatCard label="Output file" value={`${safeOutputName}.jpg`} />
              </div>

              {sizeDifference !== null && sizeDifference < 0 && (
                <ToolInfoBox>
                  This JPG is larger than the original PNG. Try reducing the JPG
                  quality if your goal is smaller file size.
                </ToolInfoBox>
              )}
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertImage}
          disabled={!selectedImage || loading || readingImage}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Converting image..." : "Convert to JPG"}
        </button>

        {convertedImage && (
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
        PNG to JPG conversion happens locally in your browser. Your image is not
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