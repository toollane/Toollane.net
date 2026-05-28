"use client";

import { useRef, useState } from "react";

export default function MemeGeneratorClient() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [imageUrl, setImageUrl] =
    useState("");

  const [topText, setTopText] =
    useState("TOP TEXT");

  const [bottomText, setBottomText] =
    useState("BOTTOM TEXT");

  const drawMeme = (
    imageSource: string,
    top: string,
    bottom: string
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const fontSize =
        Math.max(
          28,
          canvas.width / 12
        );

      context.font = `bold ${fontSize}px Impact, Arial`;
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.lineWidth = fontSize / 12;
      context.textAlign = "center";

      context.strokeText(
        top.toUpperCase(),
        canvas.width / 2,
        fontSize + 20
      );

      context.fillText(
        top.toUpperCase(),
        canvas.width / 2,
        fontSize + 20
      );

      context.strokeText(
        bottom.toUpperCase(),
        canvas.width / 2,
        canvas.height - 30
      );

      context.fillText(
        bottom.toUpperCase(),
        canvas.width / 2,
        canvas.height - 30
      );
    };

    image.src = imageSource;
  };

  const handleImage = (
    file: File | null
  ) => {
    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(file);

    setImageUrl(url);

    drawMeme(url, topText, bottomText);
  };

  const updateTopText = (
    value: string
  ) => {
    setTopText(value);

    if (imageUrl) {
      drawMeme(
        imageUrl,
        value,
        bottomText
      );
    }
  };

  const updateBottomText = (
    value: string
  ) => {
    setBottomText(value);

    if (imageUrl) {
      drawMeme(
        imageUrl,
        topText,
        value
      );
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "meme.png";
      link.click();

      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Meme Generator
        </h2>

        <p className="text-black/60 leading-7">
          Create memes instantly from
          your own images and download
          them as PNG files.
        </p>
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) =>
          handleImage(
            event.target.files?.[0] ||
              null
          )
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={topText}
        onChange={(event) =>
          updateTopText(
            event.target.value
          )
        }
        placeholder="Top text"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <input
        value={bottomText}
        onChange={(event) =>
          updateBottomText(
            event.target.value
          )
        }
        placeholder="Bottom text"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <div className="bg-white border border-black/10 rounded-3xl p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-2xl"
        />
      </div>

      <button
        onClick={downloadMeme}
        disabled={!imageUrl}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Download Meme
      </button>
    </div>
  );
}