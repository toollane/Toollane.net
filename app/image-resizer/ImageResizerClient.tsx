"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export default function ImageResizerClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageName, setImageName] = useState("");
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [quality, setQuality] = useState(0.9);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setImageName(file.name);
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      setError("");
      setPreviewUrl(URL.createObjectURL(file));
    };

    img.src = URL.createObjectURL(file);
  }

  function updateWidth(nextWidth: number) {
    setWidth(nextWidth);

    if (lockAspectRatio && originalWidth && originalHeight) {
      setHeight(Math.round(nextWidth * (originalHeight / originalWidth)));
    }
  }

  function updateHeight(nextHeight: number) {
    setHeight(nextHeight);

    if (lockAspectRatio && originalWidth && originalHeight) {
      setWidth(Math.round(nextHeight * (originalWidth / originalHeight)));
    }
  }

  function resizeImage() {
    if (!image || !canvasRef.current) {
      setError("Upload an image first.");
      return;
    }

    if (width <= 0 || height <= 0) {
      setError("Width and height must be greater than zero.");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    setPreviewUrl(canvas.toDataURL(format, quality));
    setError("");
  }

  function downloadImage() {
    if (!canvasRef.current) return;

    const extension = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const link = document.createElement("a");

    link.href = canvasRef.current.toDataURL(format, quality);
    link.download = `resized-image.${extension}`;
    link.click();
  }

  function resetTool() {
    setImage(null);
    setImageName("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(1200);
    setHeight(800);
    setLockAspectRatio(true);
    setQuality(0.9);
    setFormat("image/jpeg");
    setPreviewUrl("");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Resize images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Resize images in your browser with aspect-ratio lock, format selection
          and quality control.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        <div>
          <div className="text-lg font-black text-black">Upload image</div>
          <div className="mt-2 text-sm text-black/60">PNG, JPG, WEBP and other browser-supported images</div>
          {imageName && <div className="mt-4 text-sm font-bold text-black">{imageName}</div>}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {image && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label="Width px" value={width} onChange={updateWidth} />
            <NumberInput label="Height px" value={height} onChange={updateHeight} />

            <label className="block">
              <span className="text-sm font-bold text-black">Output format</span>
              <select value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black">
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Quality: {Math.round(quality * 100)}%</span>
              <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-5 w-full" />
            </label>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
            <span className="text-sm font-bold text-black">Lock aspect ratio</span>
            <input type="checkbox" checked={lockAspectRatio} onChange={(event) => setLockAspectRatio(event.target.checked)} className="h-5 w-5 accent-black" />
          </label>

          <ToolResultBox title="Image preview">
            {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-[520px] w-full rounded-[2rem] border border-black/10 object-contain" />}

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <ResultCard label="Original" value={`${originalWidth} × ${originalHeight}`} />
              <ResultCard label="New size" value={`${width} × ${height}`} />
              <ResultCard label="Scale" value={`${((width / originalWidth) * 100).toFixed(1)}%`} />
            </div>
          </ToolResultBox>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={resizeImage} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
              Apply resize
            </button>

            <button type="button" onClick={downloadImage} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
              Download image
            </button>

            <button type="button" onClick={resetTool} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
              Reset
            </button>
          </div>
        </>
      )}

      <ToolInfoBox>
        Resizing happens locally in your browser. Use JPG for smaller photos, PNG
        for transparency and WEBP for modern web optimization.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">{label}</div>
      <div className="mt-2 text-xl font-black text-black">{value}</div>
    </div>
  );
}