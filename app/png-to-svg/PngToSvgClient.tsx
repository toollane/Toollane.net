"use client";

import { useState } from "react";

export default function PngToSvgClient() {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const convertToSvg = async () => {
    if (!file) {
      return;
    }

    const dataUrl =
      await new Promise<string>(
        (resolve) => {
          const reader =
            new FileReader();

          reader.onload = () =>
            resolve(
              reader.result as string
            );

          reader.readAsDataURL(file);
        }
      );

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><image href="${dataUrl}" width="1024" height="1024" preserveAspectRatio="xMidYMid meet"/></svg>`;

    const blob = new Blob(
      [svgContent],
      {
        type: "image/svg+xml",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "image.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          PNG to SVG
        </h2>

        <p className="text-black/60 leading-7">
          Convert PNG images into SVG
          files instantly in your
          browser.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          const selectedFile =
            event.target.files?.[0] ||
            null;

          setFile(selectedFile);

          if (selectedFile) {
            setPreview(
              URL.createObjectURL(
                selectedFile
              )
            );
          } else {
            setPreview("");
          }
        }}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={convertToSvg}
        disabled={!file}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Convert to SVG
      </button>

      {preview && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 grid gap-4">
          <div className="font-semibold">
            Preview
          </div>

          <img
            src={preview}
            alt="Preview"
            className="max-w-full rounded-2xl border border-black/10"
          />
        </div>
      )}
    </div>
  );
}