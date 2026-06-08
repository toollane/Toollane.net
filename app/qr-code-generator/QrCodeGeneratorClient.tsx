"use client";

import { useMemo, useState } from "react";
import QRCode from "react-qr-code";

import ToolErrorBox from "@/components/ToolErrorBox";
import ToolInfoBox from "@/components/ToolInfoBox";
import ToolResultBox from "@/components/ToolResultBox";

const EXAMPLE_VALUE = "https://toollane.net";

export default function QrCodeGeneratorClient() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState(256);
  const [error, setError] = useState("");

  const qrValue = useMemo(() => {
    return value.trim() || EXAMPLE_VALUE;
  }, [value]);

  function downloadQr() {
    const svg = document.getElementById("qr-code");

    if (!svg) {
      setError("QR code could not be found.");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "toollane-qr-code.svg";
    link.click();

    URL.revokeObjectURL(url);
    setError("");
  }

  function loadExample() {
    setValue(EXAMPLE_VALUE);
    setSize(256);
    setError("");
  }

  function clearQr() {
    setValue("");
    setSize(256);
    setError("");
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Create a free QR code
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Enter a URL, text, contact detail or any short information and
          instantly generate a scannable QR code.
        </p>
      </div>

      {error && <ToolErrorBox message={error} />}

      <ToolResultBox title="QR code content">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Text or URL
          </span>

          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="mt-3 min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm leading-7 text-black outline-none transition placeholder:text-black/35 focus:border-black"
            placeholder="Paste a URL, text, WiFi details, contact info or any content you want to turn into a QR code..."
          />
        </label>

        <label className="mt-6 block">
          <span className="text-sm font-bold text-black">
            QR code size: {size}px
          </span>

          <input
            type="range"
            min="120"
            max="400"
            step="8"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="mt-4 w-full"
          />
        </label>
      </ToolResultBox>

      <ToolResultBox title="Generated QR code">
        <div className="flex justify-center rounded-[2rem] border border-black/10 bg-white p-8">
          <QRCode
            id="qr-code"
            value={qrValue}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
          />
        </div>

        {!value.trim() && (
          <p className="mt-4 text-center text-sm leading-6 text-black/50">
            Preview is showing an example QR code. Add your own content above to
            generate a custom QR code.
          </p>
        )}
      </ToolResultBox>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadQr}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Download SVG
        </button>

        <button
          type="button"
          onClick={loadExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Load example
        </button>

        <button
          type="button"
          onClick={clearQr}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Clear
        </button>
      </div>

      <ToolInfoBox>
        QR codes can be used for websites, business cards, flyers, menus,
        packaging, social media profiles and quick sharing. Always test the QR
        code with your phone before printing or publishing it.
      </ToolInfoBox>
    </div>
  );
}