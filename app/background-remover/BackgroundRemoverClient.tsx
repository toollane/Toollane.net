"use client";

import { useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type ResultImage = {
  url: string;
  width: number;
  height: number;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be loaded."));
    };

    image.src = url;
  });
}

function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
) {
  return Math.sqrt(
    (r1 - r2) ** 2 +
      (g1 - g2) ** 2 +
      (b1 - b2) ** 2
  );
}

export default function BackgroundRemoverClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState<ResultImage | null>(null);
  const [tolerance, setTolerance] = useState(42);
  const [edgeSoftness, setEdgeSoftness] = useState(20);
  const [pickedColor, setPickedColor] = useState<[number, number, number] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(selectedFiles: FileList | File[]) {
    setError("");
    setResult(null);
    setPickedColor(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (result) {
      URL.revokeObjectURL(result.url);
    }

    const selectedFile = Array.from(selectedFiles)[0];

    if (!selectedFile) return;

    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      selectedFile.type
    );

    if (!isImage) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreviewUrl(nextPreviewUrl);
  }

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result) URL.revokeObjectURL(result.url);

    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setPickedColor(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function removeBackground() {
    setError("");

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);

    try {
      if (result) {
        URL.revokeObjectURL(result.url);
        setResult(null);
      }

      const image = await loadImage(file);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!context) {
        throw new Error("Canvas is not supported.");
      }

      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const data = imageData.data;

      const sample =
        pickedColor ||
        getCornerAverageColor(data, canvas.width, canvas.height);

      const [targetR, targetG, targetB] = sample;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distance = colorDistance(r, g, b, targetR, targetG, targetB);

        if (distance <= tolerance) {
          data[i + 3] = 0;
        } else if (distance <= tolerance + edgeSoftness) {
          const fade =
            (distance - tolerance) / Math.max(edgeSoftness, 1);

          data[i + 3] = Math.round(255 * fade);
        }
      }

      context.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) {
        throw new Error("Could not create PNG.");
      }

      const url = URL.createObjectURL(blob);

      setResult({
        url,
        width: canvas.width,
        height: canvas.height,
      });
    } catch {
      setError(
        "Something went wrong while removing the background. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadResult() {
    if (!result || !file) return;

    const cleanName = file.name.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");

    link.href = result.url;
    link.download = `${cleanName}-transparent.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function pickColorFromPreview(
    event: React.MouseEvent<HTMLCanvasElement>
  ) {
    if (!file || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor(
      ((event.clientX - rect.left) / rect.width) * canvas.width
    );

    const y = Math.floor(
      ((event.clientY - rect.top) / rect.height) * canvas.height
    );

    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) return;

    const pixel = context.getImageData(x, y, 1, 1).data;

    setPickedColor([pixel[0], pixel[1], pixel[2]]);
  }

  async function drawPreviewCanvas() {
    if (!file || !canvasRef.current) return;

    try {
      const image = await loadImage(file);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);
    } catch {}
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Remove image background
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Upload an image and remove simple solid-color backgrounds directly in
          your browser. Best for logos, product shots, icons and clean
          backgrounds.
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className="rounded-[2rem] border-2 border-dashed border-black/15 bg-[#fff8df] p-6 text-center transition hover:border-black/25 sm:p-8"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }
          }}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
          BG
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">
          Drop an image here
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Your image stays private and is processed in your browser.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Choose image
        </button>
      </div>

      {error && <ToolErrorBox message={error} />}

      {file ? (
        <ToolResultBox title="Background removal settings">
          <div className="grid gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="font-bold text-black">{file.name}</div>
              <p className="mt-2 text-xs leading-5 text-black/50">
                Tip: click on the preview image to choose the background color.
                If you do not pick a color, Toollane estimates it from the
                corners.
              </p>
            </div>

            <canvas
              ref={(node) => {
                canvasRef.current = node;
                void drawPreviewCanvas();
              }}
              onClick={pickColorFromPreview}
              className="max-h-[420px] w-full cursor-crosshair rounded-2xl border border-black/10 bg-white object-contain"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-black">
                  Tolerance: {tolerance}
                </span>

                <input
                  type="range"
                  min="5"
                  max="120"
                  value={tolerance}
                  onChange={(event) =>
                    setTolerance(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-black"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-black">
                  Edge softness: {edgeSoftness}
                </span>

                <input
                  type="range"
                  min="0"
                  max="80"
                  value={edgeSoftness}
                  onChange={(event) =>
                    setEdgeSoftness(Number(event.target.value))
                  }
                  className="mt-4 w-full accent-black"
                />
              </label>
            </div>

            {pickedColor && (
              <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/60">
                Picked color: rgb({pickedColor[0]}, {pickedColor[1]},{" "}
                {pickedColor[2]})
              </div>
            )}
          </div>
        </ToolResultBox>
      ) : (
        <ToolInfoBox>
          Upload an image with a simple background. For complex photos, AI-based
          background removal usually gives better results.
        </ToolInfoBox>
      )}

      {result && (
        <ToolResultBox title="Transparent PNG result">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-black/10 bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-4">
              <img
                src={result.url}
                alt="Background removed result"
                className="mx-auto max-h-[420px] object-contain"
              />
            </div>

            <button
              type="button"
              onClick={downloadResult}
              className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Download transparent PNG
            </button>
          </div>
        </ToolResultBox>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={removeBackground}
          disabled={!file || loading}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Removing background..." : "Remove background"}
        </button>

        <button
          type="button"
          onClick={clearImage}
          disabled={!file || loading}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear image
        </button>
      </div>

      <ToolInfoBox>
        This browser-based remover works best for solid or simple backgrounds.
        It does not use external AI processing, so your image stays on your
        device.
      </ToolInfoBox>
    </div>
  );
}

function getCornerAverageColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): [number, number, number] {
  const points = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  let r = 0;
  let g = 0;
  let b = 0;

  for (const [x, y] of points) {
    const index = (y * width + x) * 4;

    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
  }

  return [
    Math.round(r / points.length),
    Math.round(g / points.length),
    Math.round(b / points.length),
  ];
}