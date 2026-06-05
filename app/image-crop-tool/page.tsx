import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCropToolClient from "./ImageCropToolClient";

export const metadata: Metadata = {
  title: "Image Crop Tool | Toollane",
  description:
    "Crop images online instantly with Toollane's free browser-based image crop tool.",
};

export default function ImageCropToolPage() {
  return (
    <ToolPageLayout
      title="Image Crop Tool"
      description="Crop images instantly online."


      href="/image-crop-tool"
    >
      <ImageCropToolClient />
    </ToolPageLayout>
  );
}