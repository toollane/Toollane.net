"use client";

import { useState } from "react";

import NumberInput from "@/components/NumberInput";

export default function ImageCropToolClient() {
  const [image, setImage] = useState("");
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropWidth, setCropWidth] = useState("500");
  const [cropHeight, setCropHeight] = useState("500");
  const [croppedImage, setCroppedImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setCroppedImage("");
    };

    reader.readAsDataURL(file);
  };

  const cropImage = () => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) return;

      const x = parseInt(cropX, 10) || 0;
      const y = parseInt(cropY, 10) || 0;
      const width = parseInt(cropWidth, 10) || img.width;
      const height = parseInt(cropHeight, 10) || img.height;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(img, x, y, width, height, 0, 0, width, height);

      setCroppedImage(canvas.toDataURL("image/png"));
    };

    img.src = image;
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Crop Image Online</h2>

        <p className="text-black/60 leading-7">
          Crop images directly in your browser by setting crop position and size.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      {image && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <NumberInput label="X Position" value={cropX} onChange={setCropX} placeholder="0" />
            <NumberInput label="Y Position" value={cropY} onChange={setCropY} placeholder="0" />
            <NumberInput label="Crop Width" value={cropWidth} onChange={setCropWidth} placeholder="500" />
            <NumberInput label="Crop Height" value={cropHeight} onChange={setCropHeight} placeholder="500" />
          </div>

          <button
            onClick={cropImage}
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
          >
            Crop Image
          </button>

          <img
            src={image}
            alt="Original preview"
            className="max-w-full rounded-3xl border border-black/10"
          />
        </>
      )}

      {croppedImage && (
        <div className="grid gap-6">
          <img
            src={croppedImage}
            alt="Cropped preview"
            className="max-w-full rounded-3xl border border-black/10"
          />

          <a
            href={croppedImage}
            download="cropped-image.png"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download Cropped Image
          </a>
        </div>
      )}
    </div>
  );
}