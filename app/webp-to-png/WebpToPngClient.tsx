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

export default function WebpToPngClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [pngUrl, setPngUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [maxWidth, setMaxWidth] = useState(2000);
  const [keepTransparency, setKeepTransparency] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [error, setError] = useState("");

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid WEBP image.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setImageName(file.name);
      setOriginalSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
      setPngUrl("");
      setConvertedSize(0);
      setMaxWidth(img.width);
      setError("");
    };

    img.src = URL.createObjectURL(file);
  }

  function convertImage() {
    if (!image || !canvasRef.current) {
      setError("Upload a WEBP image first.");
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

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Could not convert this WEBP image to PNG.");
        return;
      }

      setConvertedSize(blob.size);
      setPngUrl(URL.createObjectURL(blob));
      setError("");
    }, "image/png");
  }

  function downloadImage() {
    if (!pngUrl) return;

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "converted.png";
    link.click();
  }

  function resetTool() {
    setImage(null);
    setImageName("");
    setPreviewUrl("");
    setPngUrl("");
    setOriginalSize(0);
    setConvertedSize(0);
    setMaxWidth(2000);
    setKeepTransparency(true);
    setBackgroundColor("#ffffff");
    setError("");
  }

  const sizeChange =
    originalSize && convertedSize
      ? ((convertedSize - originalSize) / originalSize) * 100
      : 0;

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Convert WEBP to PNG
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Convert WEBP images to PNG with transparency support, resize control
          and browser-based processing.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/webp,image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">Upload WEBP image</div>
          <div className="mt-2 text-sm text-black/60">
            Convert WEBP to PNG for editing, design and compatibility
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
          </div>

          <ToolResultBox title="Conversion result">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard label="Original WEBP size" value={formatBytes(originalSize)} />
              <ResultCard
                label="PNG size"
                value={convertedSize ? formatBytes(convertedSize) : "Not converted"}
              />
              <ResultCard
                label="Size change"
                value={convertedSize ? `${sizeChange.toFixed(1)}%` : "—"}
              />
            </div>

            <img
              src={pngUrl || previewUrl}
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
              Convert to PNG
            </button>

            <button
              type="button"
              onClick={downloadImage}
              disabled={!pngUrl}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
            >
              Download PNG
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
        PNG is useful for editing, transparency, design workflows and broad app
        compatibility. File size may be larger than WEBP.
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