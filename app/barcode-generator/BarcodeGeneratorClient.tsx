"use client";

import { useEffect, useRef, useState } from "react";

import JsBarcode from "jsbarcode";

import ToolInfoBox from "@/components/ToolInfoBox";

const TYPES = [
  "CODE128",
  "EAN13",
  "EAN8",
  "UPC",
  "CODE39",
];

export default function BarcodeGeneratorClient() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [value, setValue] = useState("123456789012");
  const [type, setType] = useState("CODE128");
  const [showValue, setShowValue] = useState(true);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      JsBarcode(svgRef.current, value, {
        format: type,
        displayValue: showValue,
        background: "#ffffff",
        lineColor: "#000000",
      });
    } catch {}
  }, [value, type, showValue]);

  function downloadBarcode() {
    const svg = svgRef.current;

    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "barcode.svg";
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetExample() {
    setValue("123456789012");
    setType("CODE128");
    setShowValue(true);
  }

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Generate barcodes online
        </h2>

        <p className="mt-3 text-sm leading-7 text-black/60 sm:text-base">
          Create printable barcodes for products, inventory, logistics, labels
          and retail systems.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-bold text-black">
            Barcode value
          </span>

          <input
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-black">
            Barcode format
          </span>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
          >
            {TYPES.map((barcodeType) => (
              <option
                key={barcodeType}
                value={barcodeType}
              >
                {barcodeType}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-black/10 bg-[#fff8df] px-5 py-4">
          <span className="text-sm font-bold text-black">
            Show barcode text
          </span>

          <input
            type="checkbox"
            checked={showValue}
            onChange={(event) =>
              setShowValue(event.target.checked)
            }
            className="h-5 w-5 accent-black"
          />
        </label>
      </div>

      <div className="flex justify-center rounded-[2rem] border border-black/10 bg-white p-8">
        <svg ref={svgRef} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadBarcode}
          className="rounded-2xl bg-black px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          Download barcode
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
        <code>npm install jsbarcode</code>
      </ToolInfoBox>
    </div>
  );
}