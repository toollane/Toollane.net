"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export default function ImageCropToolClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(800);
  const [cropHeight, setCropHeight] = useState(800);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.92);
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
      setCropX(0);
      setCropY(0);
      setCropWidth(Math.min(img.width, 800));
      setCropHeight(Math.min(img.height, 800));
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    };

    img.src = URL.createObjectURL(file);
  }

  function validateCrop() {
    if (!image) {
      setError("Upload an image first.");
      return false;
    }

    if (cropWidth <= 0 || cropHeight <= 0) {
      setError("Crop width and height must be greater than zero.");
      return false;
    }

    if (cropX < 0 || cropY < 0 || cropX + cropWidth > originalWidth || cropY + cropHeight > originalHeight) {
      setError("Crop area must stay inside the original image.");
      return false;
    }

    setError("");
    return true;
  }

  function cropImage() {
    if (!validateCrop() || !image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    context.clearRect(0, 0, cropWidth, cropHeight);
    context.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    setPreviewUrl(canvas.toDataURL(format, quality));
  }

  function downloadImage() {
    if (!canvasRef.current) return;

    const extension =
      format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";

    const link = document.createElement("a");

    link.href = canvasRef.current.toDataURL(format, quality);
    link.download = `cropped-image.${extension}`;
    link.click();
  }

  function applyPreset(width: number, height: number) {
    if (!originalWidth || !originalHeight) return;

    const scale = Math.min(originalWidth / width, originalHeight / height);
    const nextWidth = Math.round(width * scale);
    const nextHeight = Math.round(height * scale);

    setCropWidth(nextWidth);
    setCropHeight(nextHeight);
    setCropX(Math.max(0, Math.round((originalWidth - nextWidth) / 2)));
    setCropY(Math.max(0, Math.round((originalHeight - nextHeight) / 2)));
    setError("");
  }

  function resetTool() {
    setImage(null);
    setImageName("");
    setPreviewUrl("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCropX(0);
    setCropY(0);
    setCropWidth(800);
    setCropHeight(800);
    setFormat("image/png");
    setQuality(0.92);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Crop images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Crop images by exact pixel values, aspect-ratio presets and export as
          PNG, JPG or WEBP.
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
          <div className="grid gap-3 sm:grid-cols-4">
            <button type="button" onClick={() => applyPreset(1, 1)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black hover:bg-black/5">
              Square 1:1
            </button>

            <button type="button" onClick={() => applyPreset(16, 9)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black hover:bg-black/5">
              Wide 16:9
            </button>

            <button type="button" onClick={() => applyPreset(9, 16)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black hover:bg-black/5">
              Story 9:16
            </button>

            <button type="button" onClick={() => applyPreset(4, 5)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black hover:bg-black/5">
              Portrait 4:5
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <NumberInput label="X position" value={cropX} onChange={setCropX} onBlur={validateCrop} />
            <NumberInput label="Y position" value={cropY} onChange={setCropY} onBlur={validateCrop} />
            <NumberInput label="Crop width" value={cropWidth} onChange={setCropWidth} onBlur={validateCrop} />
            <NumberInput label="Crop height" value={cropHeight} onChange={setCropHeight} onBlur={validateCrop} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-black">Output format</span>

              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as OutputFormat)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-black">Quality: {Math.round(quality * 100)}%</span>
              <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-5 w-full" />
            </label>
          </div>

          <ToolResultBox title="Crop preview">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Crop preview"
                className="max-h-[560px] w-full rounded-[2rem] border border-black/10 object-contain"
              />
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <ResultCard label="Original size" value={`${originalWidth} × ${originalHeight}`} />
              <ResultCard label="Crop size" value={`${cropWidth} × ${cropHeight}`} />
              <ResultCard label="Crop ratio" value={`${(cropWidth / cropHeight).toFixed(3)}:1`} />
            </div>
          </ToolResultBox>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={cropImage} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
              Apply crop
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
        Cropping happens locally in your browser. Use square crops for profile
        images, 16:9 for video thumbnails and 9:16 for vertical stories.
      </ToolInfoBox>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} onBlur={onBlur} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black" />
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