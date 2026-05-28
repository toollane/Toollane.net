"use client";

import { useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function ImageResizerClient() {
  const [image, setImage] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("600");
  const [resizedImage, setResizedImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setResizedImage("");
    };

    reader.readAsDataURL(file);
  };

  const resizeImage = () => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const targetWidth = parseInt(width, 10);
      const targetHeight = parseInt(height, 10);

      if (
        isNaN(targetWidth) ||
        isNaN(targetHeight) ||
        targetWidth <= 0 ||
        targetHeight <= 0
      ) {
        return;
      }

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.drawImage(img, 0, 0, targetWidth, targetHeight);

      setResizedImage(canvas.toDataURL("image/png"));
    };

    img.src = image;
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Image Resizer
        </h2>

        <p className="text-black/60 leading-7">
          Resize images online for websites, social media and documents directly in your browser.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <NumberInput
          label="Width"
          value={width}
          onChange={setWidth}
          placeholder="800"
        />

        <NumberInput
          label="Height"
          value={height}
          onChange={setHeight}
          placeholder="600"
        />
      </div>

      <button
        onClick={resizeImage}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Resize Image
      </button>

      {image && (
        <div>
          <div className="text-sm text-black/50 mb-2">
            Original Preview
          </div>

          <img
            src={image}
            alt="Original preview"
            className="max-w-full rounded-3xl border border-black/10"
          />
        </div>
      )}

      {resizedImage && (
        <div className="grid gap-6">
          <div>
            <div className="text-sm text-black/50 mb-2">
              Resized Preview
            </div>

            <img
              src={resizedImage}
              alt="Resized preview"
              className="max-w-full rounded-3xl border border-black/10"
            />
          </div>

          <a
            href={resizedImage}
            download="resized-image.png"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}