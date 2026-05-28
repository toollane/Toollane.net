"use client";

import { useState } from "react";

export default function FaviconGeneratorClient() {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const handleFileChange = (
    selectedFile: File | null
  ) => {
    setFile(selectedFile);

    if (!selectedFile) {
      setPreview("");
      return;
    }

    const url =
      URL.createObjectURL(selectedFile);

    setPreview(url);
  };

  const downloadFavicon = () => {
    if (!file) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      const canvas =
        document.createElement("canvas");

      canvas.width = 64;
      canvas.height = 64;

      const context =
        canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, 64, 64);

      context.drawImage(
        image,
        0,
        0,
        64,
        64
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;
        link.download = "favicon.png";
        link.click();

        URL.revokeObjectURL(url);
      }, "image/png");
    };

    image.src = preview;
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Favicon Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create a favicon from any
          image instantly in your
          browser.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) =>
          handleFileChange(
            event.target.files?.[0] ||
              null
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {preview && (
        <div className="bg-white border border-black/10 rounded-3xl p-6 grid gap-4">
          <div className="font-semibold">
            Preview
          </div>

          <img
            src={preview}
            alt="Favicon preview"
            className="w-16 h-16 rounded-xl border border-black/10 object-cover"
          />
        </div>
      )}

      <button
        onClick={downloadFavicon}
        disabled={!file}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Download Favicon
      </button>
    </div>
  );
}