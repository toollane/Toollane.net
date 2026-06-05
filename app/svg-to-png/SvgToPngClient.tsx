"use client";

import { useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function extractSvgSize(svgText: string) {
  const widthMatch = svgText.match(/width=["']?([\d.]+)/i);
  const heightMatch = svgText.match(/height=["']?([\d.]+)/i);
  const viewBoxMatch = svgText.match(/viewBox=["']([^"']+)["']/i);

  if (widthMatch && heightMatch) {
    return {
      width: Math.round(Number(widthMatch[1])),
      height: Math.round(Number(heightMatch[1])),
    };
  }

  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/).map(Number);

    if (parts.length === 4) {
      return {
        width: Math.round(parts[2]),
        height: Math.round(parts[3]),
      };
    }
  }

  return {
    width: 1024,
    height: 1024,
  };
}

export default function SvgToPngClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [svgText, setSvgText] = useState(`<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" rx="48" fill="#3B82F6"/>
  <circle cx="400" cy="250" r="120" fill="#FACC15"/>
  <text x="400" y="265" text-anchor="middle" font-size="56" font-family="Arial" font-weight="700" fill="#111827">SVG</text>
</svg>`);
  const [fileName, setFileName] = useState("");
  const [scale, setScale] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [pngUrl, setPngUrl] = useState("");
  const [pngSize, setPngSize] = useState(0);
  const [error, setError] = useState("");

  const size = useMemo(() => extractSvgSize(svgText), [svgText]);

  const outputWidth = Math.max(1, Math.round(size.width * scale));
  const outputHeight = Math.max(1, Math.round(size.height * scale));

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      setError("Please upload a valid SVG file.");
      return;
    }

    const text = await file.text();

    if (!text.includes("<svg")) {
      setError("This file does not look like a valid SVG.");
      return;
    }

    setSvgText(text);
    setFileName(file.name);
    setPngUrl("");
    setPngSize(0);
    setError("");
  }

  function convertSvgToPng() {
    if (!svgText.trim().includes("<svg")) {
      setError("Enter or upload valid SVG markup.");
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const svgBlob = new Blob([svgText], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      context.clearRect(0, 0, outputWidth, outputHeight);

      if (!transparentBackground) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, outputWidth, outputHeight);
      }

      context.drawImage(image, 0, 0, outputWidth, outputHeight);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);

        if (!blob) {
          setError("Could not create PNG from this SVG.");
          return;
        }

        setPngUrl(URL.createObjectURL(blob));
        setPngSize(blob.size);
        setError("");
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Could not render this SVG. Check whether the SVG markup is valid.");
    };

    image.src = url;
  }

  function downloadPng() {
    if (!pngUrl) return;

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = fileName
      ? fileName.replace(/\.svg$/i, ".png")
      : "converted-svg.png";
    link.click();
  }

  async function copySvg() {
    await navigator.clipboard.writeText(svgText);
  }

  function resetExample() {
    setSvgText(`<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="500" rx="48" fill="#3B82F6"/>
  <circle cx="400" cy="250" r="120" fill="#FACC15"/>
  <text x="400" y="265" text-anchor="middle" font-size="56" font-family="Arial" font-weight="700" fill="#111827">SVG</text>
</svg>`);
    setFileName("");
    setScale(2);
    setBackgroundColor("#ffffff");
    setTransparentBackground(true);
    setPngUrl("");
    setPngSize(0);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          SVG to PNG Converter
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Convert SVG graphics to high-resolution PNG images with custom scale,
          transparent background support and browser-based rendering.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">Upload SVG file</div>
          <div className="mt-2 text-sm text-black/60">
            Or paste/edit SVG markup below
          </div>
          {fileName && (
            <div className="mt-4 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {fileName}
            </div>
          )}
        </div>
      </label>

      <textarea
        value={svgText}
        onChange={(event) => {
          setSvgText(event.target.value);
          setPngUrl("");
          setPngSize(0);
          setError("");
        }}
        className="min-h-[300px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-sm leading-7 text-black outline-none transition focus:border-black"
        placeholder="Paste SVG markup here..."
      />

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Scale: {scale}x
          </span>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="mt-5 w-full"
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 sm:mt-8">
          <span className="text-sm font-bold text-black">
            Transparent background
          </span>
          <input
            type="checkbox"
            checked={transparentBackground}
            onChange={(event) => setTransparentBackground(event.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </label>

        {!transparentBackground && (
          <label className="block">
            <span className="text-sm font-bold text-black">Background</span>
            <input
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="mt-3 h-[54px] w-full rounded-2xl border border-black/10 bg-white"
            />
          </label>
        )}
      </div>

      <ToolResultBox title="Conversion preview">
        <div className="grid gap-4 sm:grid-cols-3">
          <ResultCard label="SVG size" value={`${size.width} × ${size.height}`} />
          <ResultCard label="PNG output" value={`${outputWidth} × ${outputHeight}`} />
          <ResultCard label="PNG file size" value={pngSize ? formatBytes(pngSize) : "Not converted"} />
        </div>

        {pngUrl ? (
          <img
            src={pngUrl}
            alt="PNG preview"
            className="mt-6 max-h-[520px] w-full rounded-[2rem] border border-black/10 object-contain"
          />
        ) : (
          <div className="mt-6 rounded-[2rem] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-black/60">
            Convert the SVG to preview the PNG output.
          </div>
        )}
      </ToolResultBox>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={convertSvgToPng}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Convert to PNG
        </button>

        <button
          type="button"
          onClick={downloadPng}
          disabled={!pngUrl}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
        >
          Download PNG
        </button>

        <button
          type="button"
          onClick={copySvg}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Copy SVG
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        SVG files are vector graphics. Exporting at a higher scale creates
        sharper PNG files for thumbnails, app icons, social graphics and UI
        assets.
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