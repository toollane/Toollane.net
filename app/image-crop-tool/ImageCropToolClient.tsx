"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type OutputFormat = "png" | "jpeg" | "webp";

type SelectedImage = {
  file: File;
  previewUrl: string;
  dataUrl: string;
  width: number;
  height: number;
};

type CroppedImage = {
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
      .replace(/^-|-$/g, "") || "cropped-image"
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

export default function ImageCropToolClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectedImageRef = useRef<SelectedImage | null>(null);
  const croppedImageRef = useRef<CroppedImage | null>(null);

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [fileName, setFileName] = useState("cropped-image");
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropWidth, setCropWidth] = useState("800");
  const [cropHeight, setCropHeight] = useState("800");
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(0.92);
  const [croppedImage, setCroppedImage] = useState<CroppedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const safeOutputName = createSafeBaseName(fileName);

  const parsedCrop = useMemo(() => {
    return {
      x: parseDimension(cropX),
      y: parseDimension(cropY),
      width: parseDimension(cropWidth),
      height: parseDimension(cropHeight),
    };
  }, [cropX, cropY, cropWidth, cropHeight]);

  const cropRatio =
    parsedCrop.width && parsedCrop.height && parsedCrop.height > 0
      ? parsedCrop.width / parsedCrop.height
      : null;

  const cropAreaPercent =
    selectedImage && parsedCrop.width && parsedCrop.height
      ? ((parsedCrop.width * parsedCrop.height) /
          (selectedImage.width * selectedImage.height)) *
        100
      : null;

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    croppedImageRef.current = croppedImage;
  }, [croppedImage]);

  useEffect(() => {
    return () => {
      if (selectedImageRef.current) {
        URL.revokeObjectURL(selectedImageRef.current.previewUrl);
      }

      if (croppedImageRef.current) {
        URL.revokeObjectURL(croppedImageRef.current.url);
      }
    };
  }, []);

  function revokeCroppedImage() {
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage.url);
      setCroppedImage(null);
    }
  }

  async function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    revokeCroppedImage();

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

      const defaultCropSize = Math.min(nextImage.width, nextImage.height, 1000);
      const defaultX = Math.max(0, Math.round((nextImage.width - defaultCropSize) / 2));
      const defaultY = Math.max(0, Math.round((nextImage.height - defaultCropSize) / 2));

      setSelectedImage(nextImage);
      setFileName(`${createSafeBaseName(file.name)}-cropped`);
      setCropX(String(defaultX));
      setCropY(String(defaultY));
      setCropWidth(String(defaultCropSize));
      setCropHeight(String(defaultCropSize));
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

  function setCropFromNumbers(x: number, y: number, width: number, height: number) {
    if (!selectedImage) return;

    const safeWidth = Math.max(1, Math.min(width, selectedImage.width));
    const safeHeight = Math.max(1, Math.min(height, selectedImage.height));
    const safeX = Math.max(0, Math.min(x, selectedImage.width - safeWidth));
    const safeY = Math.max(0, Math.min(y, selectedImage.height - safeHeight));

    revokeCroppedImage();

    setCropX(String(Math.round(safeX)));
    setCropY(String(Math.round(safeY)));
    setCropWidth(String(Math.round(safeWidth)));
    setCropHeight(String(Math.round(safeHeight)));
    setError("");
  }

  function applyPreset(ratioWidth: number, ratioHeight: number) {
    if (!selectedImage) return;

    const targetRatio = ratioWidth / ratioHeight;
    const imageRatio = selectedImage.width / selectedImage.height;

    let nextWidth = selectedImage.width;
    let nextHeight = selectedImage.height;

    if (imageRatio > targetRatio) {
      nextHeight = selectedImage.height;
      nextWidth = Math.round(nextHeight * targetRatio);
    } else {
      nextWidth = selectedImage.width;
      nextHeight = Math.round(nextWidth / targetRatio);
    }

    const nextX = Math.round((selectedImage.width - nextWidth) / 2);
    const nextY = Math.round((selectedImage.height - nextHeight) / 2);

    setCropFromNumbers(nextX, nextY, nextWidth, nextHeight);
  }

  function useFullImage() {
    if (!selectedImage) return;

    setCropFromNumbers(0, 0, selectedImage.width, selectedImage.height);
  }

  function centerCrop() {
    if (
      !selectedImage ||
      !parsedCrop.width ||
      !parsedCrop.height ||
      parsedCrop.width <= 0 ||
      parsedCrop.height <= 0
    ) {
      return;
    }

    const nextX = Math.round((selectedImage.width - parsedCrop.width) / 2);
    const nextY = Math.round((selectedImage.height - parsedCrop.height) / 2);

    setCropFromNumbers(nextX, nextY, parsedCrop.width, parsedCrop.height);
  }

  function moveCrop(position: "top" | "bottom" | "left" | "right") {
    if (
      !selectedImage ||
      !parsedCrop.width ||
      !parsedCrop.height ||
      parsedCrop.width <= 0 ||
      parsedCrop.height <= 0
    ) {
      return;
    }

    const currentX = parsedCrop.x ?? 0;
    const currentY = parsedCrop.y ?? 0;

    if (position === "top") {
      setCropFromNumbers(currentX, 0, parsedCrop.width, parsedCrop.height);
    }

    if (position === "bottom") {
      setCropFromNumbers(
        currentX,
        selectedImage.height - parsedCrop.height,
        parsedCrop.width,
        parsedCrop.height
      );
    }

    if (position === "left") {
      setCropFromNumbers(0, currentY, parsedCrop.width, parsedCrop.height);
    }

    if (position === "right") {
      setCropFromNumbers(
        selectedImage.width - parsedCrop.width,
        currentY,
        parsedCrop.width,
        parsedCrop.height
      );
    }
  }

  function validateCrop() {
    if (!selectedImage) {
      setError("Upload an image first.");
      return false;
    }

    const x = parsedCrop.x;
    const y = parsedCrop.y;
    const width = parsedCrop.width;
    const height = parsedCrop.height;

    if (
      x === null ||
      y === null ||
      width === null ||
      height === null ||
      width <= 0 ||
      height <= 0
    ) {
      setError("Crop position, width and height must be valid numbers.");
      return false;
    }

    if (x < 0 || y < 0) {
      setError("Crop position cannot be negative.");
      return false;
    }

    if (width > selectedImage.width || height > selectedImage.height) {
      setError("Crop width and height cannot be larger than the image.");
      return false;
    }

    if (x + width > selectedImage.width || y + height > selectedImage.height) {
      setError("Crop area must stay inside the original image.");
      return false;
    }

    if (width > 12000 || height > 12000) {
      setError("Crop width and height must be 12,000 px or lower.");
      return false;
    }

    setError("");
    return true;
  }

  async function cropImage() {
    setError("");
    revokeCroppedImage();

    if (!validateCrop() || !selectedImage) return;

    const x = parsedCrop.x || 0;
    const y = parsedCrop.y || 0;
    const width = parsedCrop.width || 1;
    const height = parsedCrop.height || 1;

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

      canvas.width = width;
      canvas.height = height;

      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      } else {
        context.clearRect(0, 0, width, height);
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(image, x, y, width, height, 0, 0, width, height);

      const mimeType = getMimeType(format);

      const blob = await new Promise<Blob | null>((resolve) => {
        if (format === "png") {
          canvas.toBlob(resolve, mimeType);
        } else {
          canvas.toBlob(resolve, mimeType, quality);
        }
      });

      if (!blob) {
        throw new Error("Could not create cropped image.");
      }

      setCroppedImage({
        url: URL.createObjectURL(blob),
        size: blob.size,
        width,
        height,
        format,
      });
    } catch {
      setError("Something went wrong while cropping the image.");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!croppedImage) return;

    const extension = getFileExtension(croppedImage.format);
    const link = document.createElement("a");

    link.href = croppedImage.url;
    link.download = `${safeOutputName}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function clearImage() {
    revokeCroppedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("cropped-image");
    setCropX("0");
    setCropY("0");
    setCropWidth("800");
    setCropHeight("800");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function resetTool() {
    revokeCroppedImage();

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    setSelectedImage(null);
    setFileName("cropped-image");
    setCropX("0");
    setCropY("0");
    setCropWidth("800");
    setCropHeight("800");
    setFormat("png");
    setQuality(0.92);
    setLoading(false);
    setReadingImage(false);
    setDragActive(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Crop images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Crop images by exact pixel values, aspect-ratio presets and export the
          result as PNG, JPG or WEBP directly in your browser.
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
            selectedImage
              ? `${selectedImage.width} × ${selectedImage.height}`
              : "—"
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

      <label className="block">
        <span className="text-sm font-bold text-black">Output file name</span>

        <input
          type="text"
          value={fileName}
          onChange={(event) => {
            revokeCroppedImage();
            setFileName(event.target.value);
          }}
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
        />

        <p className="mt-2 text-xs leading-5 text-black/50">
          The file will be saved as {safeOutputName}.
        </p>
      </label>

      {error && <ToolErrorBox message={error} />}

      {readingImage && (
        <ToolInfoBox>Reading image and creating preview...</ToolInfoBox>
      )}

      {selectedImage ? (
        <>
          <ToolResultBox title="Crop settings">
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
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
                <div>
                  <div className="mb-3 text-sm font-bold text-black">
                    Aspect-ratio presets
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset(1, 1)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Square 1:1
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset(16, 9)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Wide 16:9
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset(9, 16)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Story 9:16
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset(4, 5)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Portrait 4:5
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset(3, 2)}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Photo 3:2
                    </button>

                    <button
                      type="button"
                      onClick={useFullImage}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Full image
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <NumberInput label="X position" value={cropX} onChange={setCropX} />
                  <NumberInput label="Y position" value={cropY} onChange={setCropY} />
                  <NumberInput
                    label="Crop width"
                    value={cropWidth}
                    onChange={setCropWidth}
                  />
                  <NumberInput
                    label="Crop height"
                    value={cropHeight}
                    onChange={setCropHeight}
                  />
                </div>

                <div>
                  <div className="mb-3 text-sm font-bold text-black">
                    Position crop area
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={centerCrop}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Center
                    </button>

                    <button
                      type="button"
                      onClick={() => moveCrop("top")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Top
                    </button>

                    <button
                      type="button"
                      onClick={() => moveCrop("bottom")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Bottom
                    </button>

                    <button
                      type="button"
                      onClick={() => moveCrop("left")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Left
                    </button>

                    <button
                      type="button"
                      onClick={() => moveCrop("right")}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold transition hover:bg-black/5"
                    >
                      Right
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-black">
                      Output format
                    </span>

                    <select
                      value={format}
                      onChange={(event) => {
                        revokeCroppedImage();
                        setFormat(event.target.value as OutputFormat);
                      }}
                      className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPG</option>
                      <option value="webp">WEBP</option>
                    </select>
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
                        revokeCroppedImage();
                        setQuality(Number(event.target.value));
                      }}
                      disabled={format === "png"}
                      className="mt-5 w-full accent-black disabled:opacity-40"
                    />

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      JPG and WEBP support quality compression. PNG keeps
                      lossless image data.
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </ToolResultBox>

          <ToolResultBox title="Crop summary">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Original size"
                value={`${selectedImage.width} × ${selectedImage.height}`}
              />

              <StatCard
                label="Crop size"
                value={
                  parsedCrop.width && parsedCrop.height
                    ? `${parsedCrop.width} × ${parsedCrop.height}`
                    : "Invalid size"
                }
                highlight={Boolean(parsedCrop.width && parsedCrop.height)}
              />

              <StatCard
                label="Crop ratio"
                value={cropRatio ? `${cropRatio.toFixed(3)}:1` : "—"}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Crop area"
                value={
                  cropAreaPercent !== null
                    ? `${cropAreaPercent.toFixed(1)}%`
                    : "—"
                }
              />

              <StatCard
                label="Position"
                value={`${parsedCrop.x ?? 0}, ${parsedCrop.y ?? 0}`}
              />

              <StatCard label="Output" value={format.toUpperCase()} />
            </div>
          </ToolResultBox>
        </>
      ) : (
        !readingImage && (
          <ToolInfoBox>
            Upload an image to crop it. Use square crops for profile images,
            16:9 for thumbnails and 9:16 for stories.
          </ToolInfoBox>
        )
      )}

      {croppedImage && (
        <ToolResultBox title="Cropped image ready">
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-4">
              <img
                src={croppedImage.url}
                alt="Cropped preview"
                className="aspect-square w-full rounded-[1.5rem] border border-black/10 object-contain"
              />

              <button
                type="button"
                onClick={downloadImage}
                className="mt-4 w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Download cropped image
              </button>
            </div>

            <div className="grid content-start gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Output size"
                  value={formatFileSize(croppedImage.size)}
                  highlight
                />

                <StatCard
                  label="Dimensions"
                  value={`${croppedImage.width} × ${croppedImage.height}`}
                />

                <StatCard
                  label="Format"
                  value={croppedImage.format.toUpperCase()}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Output file" value={safeOutputName} />

                <StatCard
                  label="Original file"
                  value={
                    selectedImage
                      ? formatFileSize(selectedImage.file.size)
                      : "Unknown"
                  }
                />

                <StatCard
                  label="Crop ratio"
                  value={
                    croppedImage.height > 0
                      ? `${(croppedImage.width / croppedImage.height).toFixed(
                          3
                        )}:1`
                      : "—"
                  }
                />
              </div>
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={cropImage}
          disabled={!selectedImage || loading || readingImage}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Cropping image..." : "Crop image"}
        </button>

        {croppedImage && (
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
        Cropping happens locally in your browser. Use square crops for profile
        images, 16:9 for video thumbnails, 9:16 for stories and 4:5 for social
        media posts.
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