"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function PngToWebpClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [webpUrl, setWebpUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [quality, setQuality] = useState(0.85);
  const [maxWidth, setMaxWidth] = useState(2000);
  const [keepTransparency, setKeepTransparency] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [error, setError] = useState("");

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid PNG image.");
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
      setMaxWidth(img.width);
    };

    img.src = URL.createObjectURL(file);
  }

  function convertImage() {
    if (!image || !canvasRef.current) {
      setError("Upload a PNG image first.");
      return;
    }

    if (maxWidth <= 0) {
      setError("Maximum width must be greater than zero.");
      return;
    }

    const scale = Math.min(1, maxWidth / image.width);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    if (!keepTransparency) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
    }

    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Could not convert this PNG to WEBP.");
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
    setMaxWidth(2000);
    setKeepTransparency(true);
    setBackgroundColor("#ffffff");
    setError("");
  }

  const savings =
    originalSize && convertedSize
      ? ((originalSize - convertedSize) / originalSize) * 100
      : 0;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert PNG to WEBP
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert PNG images to modern WEBP format with quality control,
          optional transparency handling and size reduction preview.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/png,image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">Upload PNG image</div>
          <div className="mt-2 text-sm text-black/60">
            PNG images with or without transparency supported
          </div>
          {imageName && (
            <div className="mt-4 text-sm font-bold text-black">{imageName}</div>
          )}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {image && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-bold text-black">
                WEBP quality: {Math.round(quality * 100)}%
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="mt-5 w-full"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Max width px</span>
              <input
                type="number"
                value={maxWidth}
                onChange={(event) => setMaxWidth(Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 sm:mt-8">
              <span className="text-sm font-bold text-black">
                Keep transparency
              </span>
              <input
                type="checkbox"
                checked={keepTransparency}
                onChange={(event) => setKeepTransparency(event.target.checked)}
                className="h-5 w-5 accent-black"
              />
            </label>
          </div>

          {!keepTransparency && (
            <label className="block">
              <span className="text-sm font-bold text-black">
                Background color
              </span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="mt-3 h-[54px] w-full rounded-2xl border border-black/10 bg-white"
              />
            </label>
          )}

          <ToolResultBox title="Conversion result">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard label="Original size" value={formatBytes(originalSize)} />
              <ResultCard
                label="WEBP size"
                value={convertedSize ? formatBytes(convertedSize) : "Not converted"}
              />
              <ResultCard
                label="Estimated savings"
                value={convertedSize ? `${savings.toFixed(1)}%` : "—"}
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
        WEBP is ideal for fast websites because it often keeps visual quality
        high while reducing file size compared with PNG.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}