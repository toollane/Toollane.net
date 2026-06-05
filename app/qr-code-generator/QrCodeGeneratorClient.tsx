"use client";

import { useMemo, useState } from "react";

import QRCode from "react-qr-code";

import ToolInfoBox from "@/components/ToolInfoBox";

export default function QrCodeGeneratorClient() {
  const [value, setValue] = useState(
    "https://example.com"
  );

  const [size, setSize] = useState(240);

  const result = useMemo(() => value.trim(), [value]);

  function downloadQr() {
    const svg = document.getElementById("qr-code");

    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "qr-code.svg";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setValue("https://example.com");
    setSize(240);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate QR codes
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create QR codes for URLs, text, contact details, WiFi access, apps
          and marketing materials.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-black">
          QR code content
        </span>

        <textarea
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          className="mt-3 min-h-[180px] w-full resize-y rounded-[2rem] border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none transition focus:border-black"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-black">
          QR code size
        </span>

        <input
          type="range"
          min="120"
          max="400"
          step="10"
          value={size}
          onChange={(event) =>
            setSize(Number(event.target.value))
          }
          className="mt-4 w-full"
        />
      </label>

      <div className="flex justify-center rounded-[2rem] border border-black/10 bg-white p-8">
        <QRCode
          id="qr-code"
          value={result}
          size={size}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadQr}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Download QR code
        </button>

        <button
          type="button"
          onClick={resetExample}
          className="rounded-2xl border border-black/10 bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-black/5"
        >
          Reset
        </button>
      </div>

      <ToolInfoBox>
        Install the required package before using this component:
        <br />
        <br />
        <code>npm install react-qr-code</code>
      </ToolInfoBox>
    </div>
  );
}