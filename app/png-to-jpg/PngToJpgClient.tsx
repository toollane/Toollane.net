"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ConvertedImage = {
  url: string;
  originalName: string;
  originalSize: number;
  convertedSize: number;
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

export default function PngToJpgClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [quality, setQuality] = useState(0.92);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [convertedImage, setConvertedImage] =
    useState<ConvertedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
    }

    setConvertedImage(null);

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) return;

    const isPng =
      selectedFile.type === "image/png" ||
      selectedFile.name.toLowerCase().endsWith(".png");

    if (!isPng) {
      setError("Please select a valid PNG image.");
      setFile(null);
      setPreviewUrl("");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
    }

    setFile(null);
    setPreviewUrl("");
    setConvertedImage(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertImage() {
    setError("");

    if (!file) {
      setError("Please select a PNG image first.");
      return;
    }

    if (convertedImage) {
      URL.revokeObjectURL(convertedImage.url);
      setConvertedImage(null);
    }

    setLoading(true);

    try {
      const image = await loadImage(file);
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
        originalName: file.name,
        originalSize: file.size,
        convertedSize: blob.size,
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

    const cleanName = convertedImage.originalName.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");

    link.href = convertedImage.url;
    link.download = `${cleanName}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert PNG to JPG
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload a PNG image and convert it to JPG directly in your browser.
          Choose quality and background color for transparent areas.
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
          accept="image/png,.png"
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
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
          Choose one PNG image to convert to JPG.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose PNG image
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file && previewUrl ? (
        <ToolResultBox title="Selected image">
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
              <div className="rounded-2xl border border-black/10 bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-2">
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="h-32 w-full rounded-xl object-contain"
                />
              </div>

              <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-4">
                <div className="truncate font-bold text-black">{file.name}</div>

                <div className="mt-1 text-xs text-black/50">
                  Original size: {formatFileSize(file.size)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  JPG quality: {Math.round(quality * 100)}%
                </span>

                <input
                  type="range"
                  min="0.4"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="mt-4 w-full accent-black"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Background color
                </span>

                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(event) => setBackgroundColor(event.target.value)}
                  className="mt-3 h-12 w-full rounded-2xl border border-black/10 bg-white p-2"
                />
              </label>
            </div>
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Upload a PNG image to convert it into JPG. Transparent areas will be
          filled with your selected background color.
        </ToolInfoBox>
      )}

      {convertedImage && (
        <ToolResultBox title="Converted JPG">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  Original
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {formatFileSize(convertedImage.originalSize)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-black/40">
                  JPG file
                </div>

                <div className="mt-2 text-lg font-black text-black">
                  {formatFileSize(convertedImage.convertedSize)}
                </div>
              </div>
            </div>

            <img
              src={convertedImage.url}
              alt="Converted JPG result"
              className="max-h-[420px] w-full rounded-2xl border border-black/10 bg-white object-contain p-3"
            />

            <button
              type="button"
              onClick={downloadImage}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Download JPG
            </button>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertImage}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Converting image..." : "Convert to JPG"}
        </button>

        <button
          type="button"
          onClick={clearImage}
          disabled={!file || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear image
        </button>
      </div>
    </div>
  );
}