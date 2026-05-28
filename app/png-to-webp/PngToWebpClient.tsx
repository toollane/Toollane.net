"use client";

import { useState } from "react";

export default function PngToWebpClient() {
  const [preview, setPreview] = useState("");
  const [converted, setConverted] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;

        context.drawImage(img, 0, 0);

        setPreview(reader.result as string);
        setConverted(canvas.toDataURL("image/webp", 0.9));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">PNG to WEBP Converter</h2>

        <p className="text-black/60 leading-7">
          Convert PNG images to WEBP instantly for smaller web-friendly image files.
        </p>
      </div>

      <input
        type="file"
        accept=".png,image/png"
        onChange={handleFileChange}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {preview && (
        <div className="grid gap-6">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full rounded-3xl border border-black/10"
          />

          <a
            href={converted}
            download="converted-image.webp"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download WEBP
          </a>
        </div>
      )}
    </div>
  );
}