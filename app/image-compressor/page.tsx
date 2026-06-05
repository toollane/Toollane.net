import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor | Toollane",

  description:
    "Compress images online instantly with Toollane's free browser-based image compressor.",
};

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Compress images instantly online."


      href="/image-compressor"
    >
      <ImageCompressorClient />
    </ToolPageLayout>
  );
}