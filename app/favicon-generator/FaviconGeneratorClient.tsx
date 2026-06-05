"use client";

import { useRef, useState } from "react";

import ToolInfoBox from "@/components/ToolInfoBox";

export default function FaviconGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(
    null
  );

  const [preview, setPreview] = useState("");

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = 64;
      canvas.height = 64;

      context.clearRect(0, 0, 64, 64);

      context.drawImage(image, 0, 0, 64, 64);

      setPreview(canvas.toDataURL("image/png"));
    };

    image.src = URL.createObjectURL(file);
  }

  function downloadFavicon() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");
    link.download = "favicon.png";
    link.click();
  }

  function resetTool() {
    setPreview("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate favicons online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload an image and generate a favicon preview optimized for websites
          and browser tabs.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload image
          </div>

          <div className="mt-2 text-sm text-black/60">
            PNG, JPG, WEBP and SVG supported
          </div>
        </div>
      </label>

      <canvas ref={canvasRef} className="hidden" />

      {preview && (
        <div className="flex justify-center rounded-[2rem] border border-black/10 bg-white p-10">
          <img
            src={preview}
            alt="Favicon preview"
            className="h-24 w-24 rounded-xl border border-black/10"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadFavicon}
          disabled={!preview}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Download favicon
        </button>

        <button
          type="button"
          onClick={resetTool}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        For best results, upload a square image with high resolution and strong
        contrast.
      </ToolInfoBox>
    </div>
  );
}