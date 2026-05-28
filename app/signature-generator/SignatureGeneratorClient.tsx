"use client";

import { useRef, useState } from "react";

export default function SignatureGeneratorClient() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [drawing, setDrawing] =
    useState(false);

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.beginPath();

    ctx.moveTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );

    setDrawing(true);
  };

  const draw = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!drawing) return;

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.lineTo(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );

    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const downloadSignature = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const link =
      document.createElement("a");

    link.download =
      "signature.png";

    link.href =
      canvas.toDataURL();

    link.click();
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Signature Generator
        </h2>

        <p className="text-black/60 leading-7">
          Draw and download digital
          signatures instantly for
          documents and contracts.
        </p>
      </div>

      <div className="bg-white border border-black/10 rounded-3xl p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={900}
          height={300}
          onMouseDown={
            startDrawing
          }
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={
            stopDrawing
          }
          className="w-full bg-white rounded-2xl border border-dashed border-black/20 touch-none"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={downloadSignature}
          className="bg-black text-white rounded-2xl px-6 py-4 font-semibold"
        >
          Download Signature
        </button>

        <button
          onClick={clearCanvas}
          className="bg-white border border-black/10 rounded-2xl px-6 py-4 font-semibold"
        >
          Clear
        </button>
      </div>
    </div>
  );
}