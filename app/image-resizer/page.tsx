import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Image Resizer | Toollane",

  description:
    "Resize images online instantly with Toollane's free browser-based image resizer.",
};

export default function ImageResizerPage() {
  return (
    <ToolPageLayout
      title="Image Resizer"
      description="Resize images instantly online."


      href="/image-resizer"
    >
      <ImageResizerClient />
    </ToolPageLayout>
  );
}