"use client";

import { useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

type TextAlign = "left" | "center" | "right";

const MEME_PRESETS = [
  {
    name: "Drake Hotline",
    top: "Using boring tools",
    bottom: "Using your own SaaS",
  },
  {
    name: "Distracted Boyfriend",
    top: "Me",
    bottom: "Another Micro SaaS idea",
  },
  {
    name: "Two Buttons",
    top: "Ship fast",
    bottom: "Perfect every detail",
  },
  {
    name: "Change My Mind",
    top: "SEO traffic still wins",
    bottom: "",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function MemeGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(
    null
  );

  const [image, setImage] =
    useState<HTMLImageElement | null>(null);

  const [imageUrl, setImageUrl] = useState("");

  const [fileName, setFileName] = useState("");

  const [topText, setTopText] = useState(
    "TOP TEXT"
  );

  const [bottomText, setBottomText] =
    useState("BOTTOM TEXT");

  const [fontSize, setFontSize] = useState(52);

  const [fontFamily, setFontFamily] =
    useState("Impact");

  const [textColor, setTextColor] =
    useState("#ffffff");

  const [strokeColor, setStrokeColor] =
    useState("#000000");

  const [strokeWidth, setStrokeWidth] =
    useState(6);

  const [textAlign, setTextAlign] =
    useState<TextAlign>("center");

  const [padding, setPadding] = useState(24);

  const [downloadUrl, setDownloadUrl] =
    useState("");

  const [generatedSize, setGeneratedSize] =
    useState(0);

  const [error, setError] = useState("");

  const isReady = useMemo(() => {
    return !!image;
  }, [image]);

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImage(img);

      const url = URL.createObjectURL(file);

      setImageUrl(url);

      setFileName(file.name);

      setDownloadUrl("");

      setGeneratedSize(0);

      setError("");
    };

    img.onerror = () => {
      setError(
        "Could not load this image."
      );
    };

    img.src = URL.createObjectURL(file);
  }

  function drawWrappedText(
    context: CanvasRenderingContext2D,
    text: string,
    y: number,
    maxWidth: number
  ) {
    const words = text.split(" ");

    const lines: string[] = [];

    let line = "";

    for (const word of words) {
      const testLine = line
        ? `${line} ${word}`
        : word;

      const metrics =
        context.measureText(testLine);

      if (
        metrics.width > maxWidth &&
        line
      ) {
        lines.push(line);

        line = word;
      } else {
        line = testLine;
      }
    }

    lines.push(line);

    lines.forEach((currentLine, index) => {
      let x = padding;

      if (textAlign === "center") {
        x = context.canvas.width / 2;
      }

      if (textAlign === "right") {
        x =
          context.canvas.width - padding;
      }

      const currentY =
        y + index * (fontSize + 8);

      context.strokeText(
        currentLine,
        x,
        currentY
      );

      context.fillText(
        currentLine,
        x,
        currentY
      );
    });
  }

  function generateMeme() {
    if (!image || !canvasRef.current) {
      setError("Upload an image first.");
      return;
    }

    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.font = `900 ${fontSize}px ${fontFamily}`;

    context.fillStyle = textColor;

    context.strokeStyle = strokeColor;

    context.lineWidth = strokeWidth;

    context.textAlign = textAlign;

    context.lineJoin = "round";

    const maxWidth =
      canvas.width - padding * 2;

    drawWrappedText(
      context,
      topText.toUpperCase(),
      padding + fontSize,
      maxWidth
    );

    const bottomLines =
      bottomText.split(" ");

    let estimatedHeight =
      fontSize + 8;

    if (bottomLines.length > 6) {
      estimatedHeight *= 2;
    }

    drawWrappedText(
      context,
      bottomText.toUpperCase(),
      canvas.height -
        estimatedHeight -
        padding,
      maxWidth
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(
            "Could not generate meme."
          );

          return;
        }

        const url =
          URL.createObjectURL(blob);

        setDownloadUrl(url);

        setGeneratedSize(blob.size);

        setError("");
      },
      "image/png",
      1
    );
  }

  function downloadMeme() {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;

    link.download = "meme.png";

    link.click();
  }

  async function copyMeme() {
    if (!downloadUrl) return;

    const response = await fetch(
      downloadUrl
    );

    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  }

  function applyPreset(
    preset: (typeof MEME_PRESETS)[0]
  ) {
    setTopText(preset.top);
    setBottomText(preset.bottom);
  }

  function resetTool() {
    setImage(null);

    setImageUrl("");

    setFileName("");

    setTopText("TOP TEXT");

    setBottomText("BOTTOM TEXT");

    setFontSize(52);

    setFontFamily("Impact");

    setTextColor("#ffffff");

    setStrokeColor("#000000");

    setStrokeWidth(6);

    setTextAlign("center");

    setPadding(24);

    setDownloadUrl("");

    setGeneratedSize(0);

    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Meme Generator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Create viral memes directly in your
          browser with custom text, fonts,
          outlines, mobile support and instant
          PNG downloads.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-[#fff8df] p-6">
        <h2 className="text-lg font-black text-black">
          Built for creators and social media
        </h2>

        <ul className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
          <li>
            • Create memes for Instagram,
            TikTok, X and Reddit
          </li>

          <li>
            • Works on mobile and desktop
          </li>

          <li>
            • Download high-quality PNG memes
          </li>

          <li>
            • Add outlines, alignment and
            custom fonts
          </li>
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MEME_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() =>
              applyPreset(preset)
            }
            className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-black"
          >
            <div className="text-sm font-black text-black">
              {preset.name}
            </div>

            <div className="mt-2 text-xs text-black/60">
              {preset.top}
            </div>
          </button>
        ))}
      </div>

      <label className="flex min-h-[240px] cursor-pointer items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-white px-6 py-10 text-center transition hover:border-black">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div>
          <div className="text-lg font-black text-black">
            Upload meme image
          </div>

          <div className="mt-3 text-sm leading-6 text-black/60">
            JPG, PNG, WEBP and screenshots
            supported
          </div>

          {fileName && (
            <div className="mt-5 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white">
              {fileName}
            </div>
          )}
        </div>
      </label>

      {error && (
        <ToolErrorBox message={error} />
      )}

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Top text
          </span>

          <textarea
            value={topText}
            onChange={(event) =>
              setTopText(
                event.target.value
              )
            }
            className="mt-3 min-h-[110px] w-full rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-black"
            placeholder="Top meme text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Bottom text
          </span>

          <textarea
            value={bottomText}
            onChange={(event) =>
              setBottomText(
                event.target.value
              )
            }
            className="mt-3 min-h-[110px] w-full rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm outline-none transition focus:border-black"
            placeholder="Bottom meme text"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Font size: {fontSize}px
          </span>

          <input
            type="range"
            min="18"
            max="120"
            step="2"
            value={fontSize}
            onChange={(event) =>
              setFontSize(
                Number(event.target.value)
              )
            }
            className="mt-5 w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Font family
          </span>

          <select
            value={fontFamily}
            onChange={(event) =>
              setFontFamily(
                event.target.value
              )
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
          >
            <option>Impact</option>
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Verdana</option>
            <option>Tahoma</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Text color
          </span>

          <input
            type="color"
            value={textColor}
            onChange={(event) =>
              setTextColor(
                event.target.value
              )
            }
            className="mt-3 h-[54px] w-full rounded-2xl border border-black/10 bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Outline color
          </span>

          <input
            type="color"
            value={strokeColor}
            onChange={(event) =>
              setStrokeColor(
                event.target.value
              )
            }
            className="mt-3 h-[54px] w-full rounded-2xl border border-black/10 bg-white"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Outline width:{" "}
            {strokeWidth}px
          </span>

          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={strokeWidth}
            onChange={(event) =>
              setStrokeWidth(
                Number(event.target.value)
              )
            }
            className="mt-5 w-full"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Text alignment
          </span>

          <select
            value={textAlign}
            onChange={(event) =>
              setTextAlign(
                event.target
                  .value as TextAlign
              )
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
          >
            <option value="left">
              Left
            </option>

            <option value="center">
              Center
            </option>

            <option value="right">
              Right
            </option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Text padding: {padding}px
          </span>

          <input
            type="range"
            min="0"
            max="100"
            step="2"
            value={padding}
            onChange={(event) =>
              setPadding(
                Number(event.target.value)
              )
            }
            className="mt-5 w-full"
          />
        </label>
      </div>

      {isReady && (
        <ToolResultBox title="Meme preview">
          <div className="grid gap-6">
            <img
              src={
                downloadUrl || imageUrl
              }
              alt="Generated meme"
              className="max-h-[700px] w-full rounded-[2rem] border border-black/10 object-contain"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard
                label="Image"
                value={
                  fileName || "Uploaded"
                }
              />

              <ResultCard
                label="Generated size"
                value={
                  generatedSize
                    ? formatBytes(
                        generatedSize
                      )
                    : "Not generated"
                }
              />

              <ResultCard
                label="Export format"
                value="PNG"
              />
            </div>
          </div>
        </ToolResultBox>
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={generateMeme}
          disabled={!isReady}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Generate Meme
        </button>

        <button
          type="button"
          onClick={downloadMeme}
          disabled={!downloadUrl}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
        >
          Download PNG
        </button>

        <button
          type="button"
          onClick={copyMeme}
          disabled={!downloadUrl}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5 disabled:opacity-50"
        >
          Copy Image
        </button>

        <button
          type="button"
          onClick={resetTool}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Meme generation happens directly in your
        browser for fast rendering and private
        editing without server uploads.
      </ToolInfoBox>
    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-black/40">
        {label}
      </div>

      <div className="mt-2 text-xl font-black text-black">
        {value}
      </div>
    </div>
  );
}