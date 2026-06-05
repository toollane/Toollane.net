"use client";

import { useMemo, useState } from "react";

import heic2any from "heic2any";

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

export default function HeicToJpgClient() {
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);

  const [quality, setQuality] = useState(0.9);
  const [maxWidth, setMaxWidth] = useState(2400);

  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const [convertedSize, setConvertedSize] = useState(0);

  const [isConverting, setIsConverting] = useState(false);

  const [error, setError] = useState("");

  const savings = useMemo(() => {
    if (!originalSize || !convertedSize) return 0;

    return (
      ((originalSize - convertedSize) / originalSize) *
      100
    );
  }, [originalSize, convertedSize]);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      extension !== "heic" &&
      extension !== "heif"
    ) {
      setError(
        "Please upload a valid HEIC or HEIF image."
      );

      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);

    setPreviewUrl("");
    setDownloadUrl("");
    setConvertedSize(0);

    setError("");
  }

  async function convertImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsConverting(true);
      setError("");

      const convertedBlob = (await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality,
      })) as Blob;

      const image = new Image();

      image.onload = () => {
        const canvas =
          document.createElement("canvas");

        const context = canvas.getContext("2d");

        if (!context) return;

        const scale = Math.min(
          1,
          maxWidth / image.width
        );

        const width = Math.round(
          image.width * scale
        );

        const height = Math.round(
          image.height * scale
        );

        canvas.width = width;
        canvas.height = height;

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError(
                "Could not generate JPG image."
              );

              setIsConverting(false);

              return;
            }

            const url =
              URL.createObjectURL(blob);

            setPreviewUrl(url);
            setDownloadUrl(url);
            setConvertedSize(blob.size);

            setIsConverting(false);
          },
          "image/jpeg",
          quality
        );
      };

      image.src =
        URL.createObjectURL(convertedBlob);
    } catch {
      setError(
        "Could not convert HEIC image. Your browser may not support this file."
      );

      setIsConverting(false);
    }
  }

  function downloadImage() {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;

    link.download =
      fileName.replace(/\.[^/.]+$/, "") +
      ".jpg";

    link.click();
  }

  function resetTool() {
    setFileName("");
    setOriginalSize(0);

    setQuality(0.9);
    setMaxWidth(2400);

    setPreviewUrl("");
    setDownloadUrl("");

    setConvertedSize(0);

    setIsConverting(false);

    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          HEIC to JPG Converter
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Convert HEIC and HEIF images from iPhone
          and Apple devices into JPG format directly
          in your browser with quality control and
          mobile-friendly downloads.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Mobile optimized conversion
        </h2>

        <ul className="mt-4 grid gap-3 text-sm text-black/70">
          <li>• Works with iPhone HEIC photos</li>
          <li>
            • Browser-based processing for privacy
          </li>
          <li>
            • Resize large camera images automatically
          </li>
          <li>
            • Download optimized JPG photos instantly
          </li>
        </ul>
      </div>

      <label className="flex min-h-[240px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          onChange={(event) => {
            handleUpload(event);
            convertImage(event);
          }}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload HEIC image
          </div>

          <div className="mt-3 text-sm leading-6 text-black/60">
            Select a HEIC or HEIF image from your
            iPhone, iPad or Apple device
          </div>

          {fileName && (
            <div className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {fileName}
            </div>
          )}
        </div>
      </label>

      {error && (
        <ToolErrorBox message={error} />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">
            JPG quality:{" "}
            {Math.round(quality * 100)}%
          </span>

          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(event) =>
              setQuality(
                Number(event.target.value)
              )
            }
            className="mt-5 w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Maximum width
          </span>

          <input
            type="number"
            value={maxWidth}
            onChange={(event) =>
              setMaxWidth(
                Number(event.target.value)
              )
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>
      </div>

      {previewUrl && (
        <ToolResultBox title="Converted JPG preview">
          <div className="grid gap-6">
            <img
              src={previewUrl}
              alt="Converted JPG preview"
              className="max-h-[600px] w-full rounded-[2rem] border border-black/10 object-contain"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="Original size"
                value={formatBytes(originalSize)}
              />

              <ResultCard
                label="JPG size"
                value={formatBytes(convertedSize)}
              />

              <ResultCard
                label="Estimated savings"
                value={`${savings.toFixed(1)}%`}
              />
            </div>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!downloadUrl || isConverting}
          onClick={downloadImage}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isConverting
            ? "Converting..."
            : "Download JPG"}
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
        HEIC conversion happens locally in your
        browser. Your images are not uploaded to a
        server.
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