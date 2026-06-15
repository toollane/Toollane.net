import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCropToolClient from "./ImageCropToolClient";

export const metadata: Metadata = {
  title: "Image Crop Tool | Crop JPG, PNG & WEBP Online | Toollane",
  description:
    "Crop images online for free. Upload JPG, PNG or WEBP files, use aspect-ratio presets, crop by exact pixel values and download the result directly in your browser.",
};

export default function ImageCropToolPage() {
  return (
    <ToolPageLayout
      title="Image Crop Tool"
      description="Crop JPG, PNG and WEBP images instantly online. Use aspect-ratio presets, exact pixel values and download cropped images directly in your browser."
      href="/image-crop-tool"
    >
      <ImageCropToolClient />
    </ToolPageLayout>
  );
}