"use client";

import { useEffect, useRef, useState } from "react";

import JsBarcode from "jsbarcode";

export default function BarcodeGeneratorClient() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [value, setValue] =
    useState("123456789012");

  const [format, setFormat] =
    useState("CODE128");

  useEffect(() => {
    if (!svgRef.current || !value) {
      return;
    }

    try {
      JsBarcode(svgRef.current, value, {
        format,
        lineColor: "#000000",
        background: "#ffffff",
        width: 2,
        height: 90,
        displayValue: true,
        fontSize: 18,
        margin: 12,
      });
    } catch {
      svgRef.current.innerHTML = "";
    }
  }, [value, format]);

  const downloadBarcode = () => {
    if (!svgRef.current) {
      return;
    }

    const svgData =
      new XMLSerializer().serializeToString(
        svgRef.current
      );

    const blob = new Blob([svgData], {
      type: "image/svg+xml",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "barcode.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">
          Barcode Generator
        </h2>

        <p className="text-black/60 leading-7">
          Generate barcodes instantly
          from text or numbers and
          download them as SVG files.
        </p>
      </div>

      <input
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        placeholder="Enter barcode value"
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      />

      <select
        value={format}
        onChange={(event) =>
          setFormat(event.target.value)
        }
        className="w-full border border-black/10 rounded-2xl px-4 py-4 bg-white"
      >
        <option value="CODE128">
          CODE128
        </option>
        <option value="EAN13">
          EAN-13
        </option>
        <option value="UPC">
          UPC
        </option>
        <option value="CODE39">
          CODE39
        </option>
      </select>

      <div className="bg-white border border-black/10 rounded-3xl p-6 overflow-x-auto">
        <svg ref={svgRef} />
      </div>

      <button
        onClick={downloadBarcode}
        disabled={!value}
        className="bg-black text-white rounded-2xl px-6 py-4 font-semibold disabled:opacity-50"
      >
        Download Barcode
      </button>
    </div>
  );
}