"use client";

import { useState } from "react";

export default function SvgToPngClient() {
  const [svgContent, setSvgContent] =
    useState("");

  const [pngImage, setPngImage] =
    useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const text =
      await file.text();

    setSvgContent(text);
    setPngImage("");
  };

  const convertSvgToPng = () => {
    if (!svgContent) return;

    const svgBlob = new Blob(
      [svgContent],
      {
        type: "image/svg+xml",
      }
    );

    const url =
      URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = () => {
      const canvas =
        document.createElement(

        );

      const context =
        canvas.getContext("2d");

      if (!context) return;

      canvas.width = img.width || 1000;
      canvas.height =
        img.height || 1000;

      context.drawImage(
        img,
        0,
        0
      );

      const png =
        canvas.toDataURL(

        );

      setPngImage(png);

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          SVG to PNG Converter
        </h2>

        <p className="text-black/60 leading-7">
          Convert SVG vector graphics
          into PNG images instantly
          in your browser.
        </p>
      </div>

      <input
        type="file"
        accept=".svg,image/svg+xml"
        onChange={
          handleFileChange
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <button
        onClick={convertSvgToPng}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
      >
        Convert to PNG
      </button>

      {pngImage && (
        <div className="grid gap-6">
          <img
            src={pngImage}
            alt="PNG Preview"
            className="max-w-full rounded-3xl border border-black/10 bg-white"
          />

          <a
            href={pngImage}
            download="converted-image.png"
            className="bg-black text-white rounded-2xl px-6 py-4 font-semibold text-center"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}