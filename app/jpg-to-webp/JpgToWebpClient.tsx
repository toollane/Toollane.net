"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function JpgToWebpClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [webpUrl, setWebpUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [quality, setQuality] = useState(0.85);
  const [error, setError] = useState("");

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid JPG image.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setImageName(file.name);
      setOriginalSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
      setWebpUrl("");
      setConvertedSize(0);
      setError("");
    };

    img.src = URL.createObjectURL(file);
  }

  function convertImage() {
    if (!image || !canvasRef.current) {
      setError("Upload a JPG image first.");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Could not convert image.");
          return;
        }

        setConvertedSize(blob.size);
        setWebpUrl(URL.createObjectURL(blob));
        setError("");
      },
      "image/webp",
      quality
    );
  }

  function downloadImage() {
    if (!webpUrl) return;

    const link = document.createElement("a");

    link.href = webpUrl;
    link.download = "converted.webp";
    link.click();
  }

  function resetTool() {
    setImage(null);
    setImageName("");
    setPreviewUrl("");
    setWebpUrl("");
    setOriginalSize(0);
    setConvertedSize(0);
    setQuality(0.85);
    setError("");
  }

  const savings =
    originalSize && convertedSize
      ? ((originalSize - convertedSize) /
          originalSize) *
        100
      : 0;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert JPG to WEBP
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert JPG images into optimized WEBP
          format with adjustable quality settings.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload JPG image
          </div>

          <div className="mt-2 text-sm text-black/60">
            JPG and JPEG images supported
          </div>

          {imageName && (
            <div className="mt-4 text-sm font-bold text-black">
              {imageName}
            </div>
          )}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {image && (
        <>
          <label className="block">
            <span className="text-sm font-bold text-black">
              WEBP quality:{" "}
              {Math.round(quality * 100)}%
            </span>

            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(event) =>
                setQuality(Number(event.target.value))
              }
              className="mt-5 w-full"
            />
          </label>

          <ToolResultBox title="Conversion result">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="Original size"
                value={formatBytes(originalSize)}
              />

              <ResultCard
                label="WEBP size"
                value={
                  convertedSize
                    ? formatBytes(convertedSize)
                    : "Not converted"
                }
              />

              <ResultCard
                label="Estimated savings"
                value={
                  convertedSize
                    ? `${savings.toFixed(1)}%`
                    : "—"
                }
              />
            </div>

            <img
              src={webpUrl || previewUrl}
              alt="Preview"
              className="mt-6 max-h-[520px] w-full rounded-[2rem] border border-black/10 object-contain"
            />
          </ToolResultBox>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={convertImage}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Convert to WEBP
            </button>

            <button
              type="button"
              onClick={downloadImage}
              disabled={!webpUrl}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
            >
              Download WEBP
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
        WEBP usually creates smaller image files than
        JPG while maintaining strong visual quality.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">
        {value}
      </div>
    </div>
  );
}