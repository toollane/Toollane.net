import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SvgToPngClient from "./SvgToPngClient";

export const metadata: Metadata = {
  title:
    "SVG to PNG Converter | Toollane",

  description:
    "Convert SVG files to PNG instantly with Toollane's free online SVG to PNG converter.",


  alternates: {
    canonical: "/svg-to-png",
  },
};

export default function SvgToPngPage() {
  return (
    <ToolPageLayout
      title="SVG to PNG Converter"
      description="Convert SVG files to PNG instantly online."


      href="/svg-to-png"
    >
      <SvgToPngClient />
    </ToolPageLayout>
  );
}