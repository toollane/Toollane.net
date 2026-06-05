"use client";

import { useMemo, useRef, useState } from "react";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const FONT_OPTIONS = [
  "Pacifico",
  "Caveat",
  "Dancing Script",
  "Great Vibes",
  "Satisfy",
  "Allura",
  "Sacramento",
];

export default function SignatureGeneratorClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [name, setName] = useState("Alex Johnson");
  const [fontFamily, setFontFamily] = useState("Pacifico");
  const [fontSize, setFontSize] = useState(84);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [padding, setPadding] = useState(40);
  const [lineWidth, setLineWidth] = useState(2);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const previewWidth = useMemo(() => {
    return Math.max(480, name.length * (fontSize * 0.8));
  }, [fontSize, name]);

  function generateSignature() {
    if (!name.trim()) {
      setError("Please enter a signature name.");
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const width = previewWidth + padding * 2;
    const height = fontSize * 2 + padding * 2;

    canvas.width = width;
    canvas.height = height;

    if (!transparentBackground) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
    } else {
      context.clearRect(0, 0, width, height);
    }

    context.font = `400 ${fontSize}px "${fontFamily}", cursive`;
    context.fillStyle = textColor;
    context.lineWidth = lineWidth;
    context.lineJoin = "round";
    context.lineCap = "round";

    context.fillText(name, padding, fontSize + padding);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Could not generate signature.");
          return;
        }

        const url = URL.createObjectURL(blob);

        setDownloadUrl(url);
        setError("");
      },
      "image/png",
      1
    );
  }

  function downloadSignature() {
    if (!downloadUrl) return;

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "signature.png";

    link.click();
  }

  async function copyImage() {
    if (!downloadUrl) return;

    const response = await fetch(downloadUrl);
    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  }

  function resetTool() {
    setName("Alex Johnson");
    setFontFamily("Pacifico");
    setFontSize(84);
    setTextColor("#000000");
    setBackgroundColor("#ffffff");
    setTransparentBackground(true);
    setPadding(40);
    setLineWidth(2);
    setDownloadUrl("");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
          Signature Generator
        </h1>

        <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">
          Create professional handwritten signatures for documents, contracts,
          branding, email signatures and online forms.
        </p>
      </div>

      {error && <ToolErrorBox message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Signature name" value={name} onChange={setName} />

        <label className="block">
          <span className="text-sm font-bold text-black">Signature font</span>

          <select
            value={fontFamily}
            onChange={(event) => setFontFamily(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Font size: {fontSize}px
          </span>

          <input
            type="range"
            min="32"
            max="160"
            step="2"
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value))}
            className="mt-5 w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Padding: {padding}px
          </span>

          <input
            type="range"
            min="0"
            max="120"
            step="2"
            value={padding}
            onChange={(event) => setPadding(Number(event.target.value))}
            className="mt-5 w-full"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">Text color</span>

          <input
            type="color"
            value={textColor}
            onChange={(event) => setTextColor(event.target.value)}
            className="mt-3 h-[56px] w-full rounded-2xl border border-black/10"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">Background</span>

          <input
            type="color"
            value={backgroundColor}
            onChange={(event) => setBackgroundColor(event.target.value)}
            className="mt-3 h-[56px] w-full rounded-2xl border border-black/10"
          />
        </label>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
        <span className="text-sm font-bold text-black">
          Transparent background
        </span>

        <input
          type="checkbox"
          checked={transparentBackground}
          onChange={(event) => setTransparentBackground(event.target.checked)}
          className="h-5 w-5 accent-black"
        />
      </label>

      <ToolResultBox title="Signature preview">
        <div
          className="overflow-auto rounded-[2rem] border border-black/10 bg-white p-8"
          style={{
            backgroundImage:
              "linear-gradient(45deg,#f3f4f6 25%,transparent 25%,transparent 75%,#f3f4f6 75%,#f3f4f6),linear-gradient(45deg,#f3f4f6 25%,transparent 25%,transparent 75%,#f3f4f6 75%,#f3f4f6)",
            backgroundPosition: "0 0,12px 12px",
            backgroundSize: "24px 24px",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize,
              color: textColor,
              background: transparentBackground ? "transparent" : backgroundColor,
              padding,
              display: "inline-block",
              borderRadius: 24,
            }}
          >
            {name}
          </div>
        </div>
      </ToolResultBox>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={generateSignature}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white"
        >
          Generate Signature
        </button>

        <button
          type="button"
          onClick={downloadSignature}
          disabled={!downloadUrl}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black disabled:opacity-50"
        >
          Download PNG
        </button>

        <button
          type="button"
          onClick={copyImage}
          disabled={!downloadUrl}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black disabled:opacity-50"
        >
          Copy Image
        </button>

        <button
          type="button"
          onClick={resetTool}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Generated signatures are ideal for digital documents, email footers,
        PDF contracts, branding assets and online approvals.
      </ToolInfoBox>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-black">{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none"
      />
    </label>
  );
}