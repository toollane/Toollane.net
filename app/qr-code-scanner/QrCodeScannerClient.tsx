"use client";

import { useEffect, useRef, useState } from "react";

import jsQR from "jsqr";

import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";
import ToolErrorBox from "@/components/ToolErrorBox";

export default function QrCodeScannerClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [imageName, setImageName] = useState("");

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageName(file.name);
    setError("");
    setResult("");

    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const code = jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );

      if (code) {
        setResult(code.data);
      } else {
        setError("No QR code detected in this image.");
      }
    };

    image.src = URL.createObjectURL(file);
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result);
  }

  function resetTool() {
    setResult("");
    setError("");
    setImageName("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Scan QR codes online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload an image containing a QR code and instantly decode its content
          directly in your browser.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload QR code image
          </div>

          <div className="mt-2 text-sm text-black/60">
            PNG, JPG, WEBP and other image formats supported
          </div>

          {imageName && (
            <div className="mt-4 text-sm font-bold text-black">
              {imageName}
            </div>
          )}
        </div>
      </label>

      <canvas ref={canvasRef} className="hidden" />

      {error && <ToolErrorBox message={error} />}

      {result && (
        <ToolResultBox title="Decoded QR code">
          <textarea
            readOnly
            value={result}
            className="min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none"
          />

          <div className="mt-5">
            <button
              type="button"
              onClick={copyResult}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Copy result
            </button>
          </div>
        </ToolResultBox>
      )}

      <button
        type="button"
        onClick={resetTool}
        className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
      >
        Reset
      </button>

      <ToolInfoBox>
        Install the required package before using this component:
        <br />
        <br />
        <code>npm install jsqr</code>
      </ToolInfoBox>
    </div>
  );
}