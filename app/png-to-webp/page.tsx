import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToWebpClient from "./PngToWebpClient";

export const metadata: Metadata = {
  title: "PNG to WEBP Converter | Toollane",
  description:
    "Convert PNG images to WEBP instantly with Toollane's free online PNG to WEBP converter.",


  alternates: {
    canonical: "/png-to-webp",
  },
};

export default function PngToWebpPage() {
  return (
    <ToolPageLayout
      title="PNG to WEBP Converter"
      description="Convert PNG images to WEBP instantly online."


      href="/png-to-webp"
    >
      <PngToWebpClient />
    </ToolPageLayout>
  );
}