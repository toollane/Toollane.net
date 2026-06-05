"use client";

import { useMemo, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function PngToSvgClient() {
  const [fileName, setFileName] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [includeBackground, setIncludeBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [title, setTitle] = useState("Converted PNG image");
  const [error, setError] = useState("");

  const svg = useMemo(() => {
    if (!imageDataUrl || !width || !height) return "";

    const background = includeBackground
      ? `  <rect width="100%" height="100%" fill="${backgroundColor}" />\n`
      : "";

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}">
  <title>${escapeXml(title)}</title>
${background}  <image href="${imageDataUrl}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  }, [imageDataUrl, width, height, includeBackground, backgroundColor, title]);

  const svgSize = useMemo(() => {
    return new Blob([svg], { type: "image/svg+xml" }).size;
  }, [svg]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "image/png" && !file.name.toLowerCase().endsWith(".png")) {
      setError("Please upload a PNG image.");
      return;
    }

    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = String(reader.result);

      image.onload = () => {
        setFileName(file.name);
        setImageDataUrl(dataUrl);
        setOriginalSize(file.size);
        setWidth(image.width);
        setHeight(image.height);
        setTitle(file.name.replace(/\.png$/i, "") || "Converted PNG image");
        setError("");
      };

      image.onerror = () => {
        setError("Could not read this PNG image.");
      };

      image.src = dataUrl;
    };

    reader.readAsDataURL(file);
  }

  async function copySvg() {
    if (!svg) return;
    await navigator.clipboard.writeText(svg);
  }

  function downloadSvg() {
    if (!svg) return;

    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName
      ? fileName.replace(/\.png$/i, ".svg")
      : "converted-image.svg";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetTool() {
    setFileName("");
    setImageDataUrl("");
    setOriginalSize(0);
    setWidth(0);
    setHeight(0);
    setIncludeBackground(false);
    setBackgroundColor("#ffffff");
    setTitle("Converted PNG image");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          PNG to SVG Converter
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Convert PNG images into SVG wrapper files for embedding, scaling,
          web usage and design workflows. This preserves the PNG image inside an
          SVG container.
        </p>
      </div>

      <label className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/png,.png"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">Upload PNG image</div>
          <div className="mt-2 text-sm text-black/60">
            Creates an SVG file that embeds your PNG image
          </div>
          {fileName && (
            <div className="mt-4 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {fileName}
            </div>
          )}
        </div>
      </label>

      {error && <ToolErrorBox message={error} />}

      {imageDataUrl && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-black">SVG title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4 sm:mt-8">
              <span className="text-sm font-bold text-black">
                Add background
              </span>
              <input
                type="checkbox"
                checked={includeBackground}
                onChange={(event) => setIncludeBackground(event.target.checked)}
                className="h-5 w-5 accent-black"
              />
            </label>
          </div>

          {includeBackground && (
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

          <ToolResultBox title="SVG result">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard label="Image size" value={`${width} × ${height}`} />
              <ResultCard label="Original PNG" value={formatBytes(originalSize)} />
              <ResultCard label="SVG size" value={formatBytes(svgSize)} />
            </div>

            <img
              src={imageDataUrl}
              alt="PNG preview"
              className="mt-6 max-h-[520px] w-full rounded-[2rem] border border-black/10 object-contain"
            />

            <textarea
              readOnly
              value={svg}
              className="mt-6 min-h-[220px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 font-mono text-xs leading-6 text-black outline-none"
            />
          </ToolResultBox>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadSvg}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Download SVG
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
              onClick={resetTool}
              className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
            >
              Reset
            </button>
          </div>
        </>
      )}

      <ToolInfoBox>
        Important: PNG to SVG conversion here creates an SVG container with an
        embedded raster image. It does not trace the image into vector paths.
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