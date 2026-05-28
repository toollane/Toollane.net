"use client";

import { useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function ImageCompressorClient() {
  const [preview, setPreview] = useState("");
  const [compressed, setCompressed] = useState("");
  const [quality, setQuality] = useState("0.7");

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          return;
        }

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);

        const compressedImage = canvas.toDataURL(

          Math.min(Math.max(parseFloat(quality), 0.1), 1)
        );

        setPreview(reader.result as string);
        setCompressed(compressedImage);
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Compress Images</h2>

        <p className="text-black/60 leading-7">
          Compress JPG or PNG images directly in your browser to reduce file size.
        </p>
      </div>

      <NumberInput
        label="Quality"
        value={quality}
        onChange={setQuality}
        placeholder="0.7"
        hint="Use a value between 0.1 and 1. Lower values create smaller files."
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
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
            href={compressed}
            download="compressed-image.jpg"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}