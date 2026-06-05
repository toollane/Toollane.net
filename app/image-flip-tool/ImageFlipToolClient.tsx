"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type FlipMode = "horizontal" | "vertical" | "both";

export default function ImageFlipToolClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [flipMode, setFlipMode] = useState<FlipMode>("horizontal");
  const [error, setError] = useState("");

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setImageName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    };

    img.src = URL.createObjectURL(file);
  }

  function flipImage() {
    if (!image || !canvasRef.current) {
      setError("Upload an image first.");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = image.width;
    canvas.height = image.height;

    context.save();

    if (flipMode === "horizontal") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    if (flipMode === "vertical") {
      context.translate(0, canvas.height);
      context.scale(1, -1);
    }

    if (flipMode === "both") {
      context.translate(canvas.width, canvas.height);
      context.scale(-1, -1);
    }

    context.drawImage(image, 0, 0);
    context.restore();

    setPreviewUrl(canvas.toDataURL("image/png"));
    setError("");
  }

  function downloadImage() {
    if (!canvasRef.current) return;

    const link = document.createElement("a");

    link.href = canvasRef.current.toDataURL("image/png");
    link.download = "flipped-image.png";
    link.click();
  }

  function resetTool() {
    setImage(null);
    setImageName("");
    setPreviewUrl("");
    setFlipMode("horizontal");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Flip images online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Flip images horizontally, vertically or both directions directly in
          your browser.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />

        <div>
          <div className="text-lg font-black text-black">Upload image</div>
          <div className="mt-2 text-sm text-black/60">PNG, JPG, WEBP and other image formats supported</div>
          {imageName && <div className="mt-4 text-sm font-bold text-black">{imageName}</div>}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {image && (
        <>
          <label className="block">
            <span className="text-sm font-bold text-black">Flip direction</span>

            <select
              value={flipMode}
              onChange={(event) => setFlipMode(event.target.value as FlipMode)}
              className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="both">Both directions</option>
            </select>
          </label>

          <ToolResultBox title="Image preview">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[520px] w-full rounded-[2rem] border border-black/10 object-contain"
              />
            )}
          </ToolResultBox>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={flipImage} className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90">
              Flip image
            </button>

            <button type="button" onClick={downloadImage} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
              Download PNG
            </button>

            <button type="button" onClick={resetTool} className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5">
              Reset
            </button>
          </div>
        </>
      )}

      <ToolInfoBox>
        Image processing happens locally in your browser. No upload to a server
        is required.
      </ToolInfoBox>
    </div>
  );
}