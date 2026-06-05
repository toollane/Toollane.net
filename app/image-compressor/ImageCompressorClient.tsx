"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type CompressedImage = {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  url: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be loaded."));
    };

    image.src = url;
  });
}

export default function ImageCompressorClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [compressedImage, setCompressedImage] =
    useState<CompressedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    setCompressedImage(null);

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) return;

    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      selectedFile.type
    );

    if (!isImage) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    setFile(selectedFile);
  }

  function clearFile() {
    if (compressedImage) {
      URL.revokeObjectURL(compressedImage.url);
    }

    setFile(null);
    setCompressedImage(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function compressImage() {
    setError("");

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    if (compressedImage) {
      URL.revokeObjectURL(compressedImage.url);
      setCompressedImage(null);
    }

    setLoading(true);

    try {
      const image = await loadImage(file);

      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);

      const outputType =
        file.type === "image/png" ? "image/jpeg" : file.type || "image/jpeg";

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, outputType, quality);
      });

      if (!blob) {
        throw new Error("Could not compress image.");
      }

      const url = URL.createObjectURL(blob);

      setCompressedImage({
        originalName: file.name,
        originalSize: file.size,
        compressedSize: blob.size,
        url,
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

    const cleanName = compressedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");

    link.href = compressedImage.url;
    link.download = `${cleanName}-compressed.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const savedPercent =
    compressedImage && compressedImage.originalSize > 0
      ? Math.max(
          0,
          ((compressedImage.originalSize - compressedImage.compressedSize) /
            compressedImage.originalSize) *
            100
        )
      : null;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Compress images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Reduce JPG, PNG or WEBP image size directly in your browser. Adjust
          quality and maximum width before downloading the optimized image.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
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
          Your image stays in your browser and is not uploaded.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose image
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file ? (
        <ToolResultBox title="Selected image">
          <div className="grid gap-5">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="truncate font-bold text-black">{file.name}</div>
              <div className="mt-1 text-xs text-black/50">
                Original size: {formatFileSize(file.size)}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  Quality: {Math.round(quality * 100)}%
                </span>

                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="mt-4 w-full accent-black"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Max width
                </span>

                <select
                  value={maxWidth}
                  onChange={(event) => setMaxWidth(Number(event.target.value))}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                >
                  <option value={800}>800 px</option>
                  <option value={1200}>1200 px</option>
                  <option value={1600}>1600 px</option>
                  <option value={2400}>2400 px</option>
                  <option value={99999}>Keep original width</option>
                </select>
              </label>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Upload an image to reduce file size. This is useful for websites,
          forms, email attachments and online applications.
        </ToolInfoBox>
      )}

      {compressedImage && (
        <ToolResultBox title="Compressed image">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Original
              </div>
              <div className="mt-2 text-lg font-black text-black">
                {formatFileSize(compressedImage.originalSize)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Compressed
              </div>
              <div className="mt-2 text-lg font-black text-black">
                {formatFileSize(compressedImage.compressedSize)}
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                Saved
              </div>
              <div className="mt-2 text-lg font-black text-black">
                {savedPercent !== null ? `${savedPercent.toFixed(1)}%` : "0%"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadImage}
            className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Download compressed image
          </button>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={compressImage}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Compressing image..." : "Compress image"}
        </button>

        <button
          type="button"
          onClick={clearFile}
          disabled={!file || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear image
        </button>
      </div>
    </div>
  );
}