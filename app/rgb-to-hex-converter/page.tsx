import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RgbToHexConverterClient from "./RgbToHexConverterClient";

export const metadata: Metadata = {
  title: "RGB to HEX Converter | Toollane",
  description:
    "Convert RGB color values to HEX instantly with Toollane's free online RGB to HEX converter.",


  alternates: {
    canonical: "/rgb-to-hex-converter",
  },
};

export default function RgbToHexConverterPage() {
  return (
    <ToolPageLayout
      title="RGB to HEX Converter"
      description="Convert RGB color values to HEX instantly online."


      href="/rgb-to-hex-converter"
    >
      <RgbToHexConverterClient />
    </ToolPageLayout>
  );
}