import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToJpgClient from "./PngToJpgClient";

export const metadata: Metadata = {
  title: "PNG to JPG Converter | Convert PNG Images Online | Toollane",
  description:
    "Convert PNG images to JPG online for free. Choose JPG quality, set a background color for transparent areas and download the converted image directly in your browser.",


  alternates: {
    canonical: "/png-to-jpg",
  },
};

export default function PngToJpgPage() {
  return (
    <ToolPageLayout
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG instantly online. Choose quality, set a background color for transparency and download the converted image directly in your browser."
      href="/png-to-jpg"
    >
      <PngToJpgClient />
    </ToolPageLayout>
  );
}