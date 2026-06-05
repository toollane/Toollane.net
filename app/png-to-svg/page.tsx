import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToSvgClient from "./PngToSvgClient";

export const metadata: Metadata = {
  title: "PNG to SVG Converter | Toollane",

  description:
    "Convert PNG images to SVG instantly with Toollane's free online PNG to SVG converter.",
};

export default function PngToSvgPage() {
  return (
    <ToolPageLayout
      title="PNG to SVG Converter"
      description="Convert PNG images to SVG instantly online."


      href="/png-to-svg"
    >
      <PngToSvgClient />
    </ToolPageLayout>
  );
}