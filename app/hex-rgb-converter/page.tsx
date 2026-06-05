import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HexRgbConverterClient from "./HexRgbConverterClient";

export const metadata: Metadata = {
  title: "HEX to RGB Converter | Toollane",

  description:
    "Convert HEX color codes to RGB instantly with Toollane's free online HEX to RGB converter.",
};

export default function HexRgbConverterPage() {
  return (
    <ToolPageLayout
      title="HEX to RGB Converter"
      description="Convert HEX color codes to RGB instantly online."


      href="/hex-rgb-converter"
    >
      <HexRgbConverterClient />
    </ToolPageLayout>
  );
}