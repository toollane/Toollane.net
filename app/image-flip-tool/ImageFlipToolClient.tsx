"use client";

import { useState } from "react";

export default function ImageFlipToolClient() {
  const [image, setImage] = useState("");
  const [flipMode, setFlipMode] = useState<"horizontal" | "vertical">(

  );
  const [flippedImage, setFlippedImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setFlippedImage("");
    };

    reader.readAsDataURL(file);
  };

  const flipImage = () => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = img.width;
      canvas.height = img.height;

      if (flipMode === "horizontal") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      } else {
        context.translate(0, canvas.height);
        context.scale(1, -1);
      }

      context.drawImage(img, 0, 0);

      setFlippedImage(canvas.toDataURL("image/png"));
    };

    img.src = image;
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Flip Images Online
        </h2>

        <p className="text-black/60 leading-7">
          Flip images horizontally or vertically and download the result instantly.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFlipMode("horizontal")}
          className={`px-5 py-3 rounded-2xl border ${
            flipMode === "horizontal"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Horizontal
        </button>

        <button
          onClick={() => setFlipMode("vertical")}
          className={`px-5 py-3 rounded-2xl border ${
            flipMode === "vertical"
              ? "bg-black text-white border-black"
              : "bg-white border-black/10"
          }`}
        >
          Vertical
        </button>
      </div>

      <button
        onClick={flipImage}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Flip Image
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

      {flippedImage && (
        <div className="grid gap-6">
          <div>
            <div className="text-sm text-black/50 mb-2">
              Flipped Preview
            </div>

            <img
              src={flippedImage}
              alt="Flipped preview"
              className="max-w-full rounded-3xl border border-black/10"
            />
          </div>

          <a
            href={flippedImage}
            download="flipped-image.png"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download Flipped Image
          </a>
        </div>
      )}
    </div>
  );
}