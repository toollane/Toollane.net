import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor | Compress JPG, PNG & WEBP Online | Toollane",
  description:
    "Compress images online for free. Reduce JPG, PNG and WEBP file size, adjust quality and resize images directly in your browser.",
};

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Compress JPG, PNG and WEBP images instantly online. Adjust quality, resize images and download optimized files directly in your browser."
      href="/image-compressor"
    >
      <ImageCompressorClient />
    </ToolPageLayout>
  );
}