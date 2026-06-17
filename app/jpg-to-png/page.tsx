import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToPngClient from "./JpgToPngClient";

export const metadata: Metadata = {
  title: "JPG to PNG Converter | Convert JPG Images Online | Toollane",
  description:
    "Convert JPG images to PNG online for free. Upload a JPG or JPEG image and download a lossless PNG file directly in your browser.",


  alternates: {
    canonical: "/jpg-to-png",
  },
};

export default function JpgToPngPage() {
  return (
    <ToolPageLayout
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG instantly online. Upload a JPG or JPEG image and download a lossless PNG file directly in your browser."
      href="/jpg-to-png"
    >
      <JpgToPngClient />
    </ToolPageLayout>
  );
}