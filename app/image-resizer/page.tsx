import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Image Resizer | Resize JPG, PNG & WEBP Online | Toollane",
  description:
    "Resize images online for free. Change image width and height, lock aspect ratio, choose JPG, PNG or WEBP output and download resized images directly in your browser.",


  alternates: {
    canonical: "/image-resizer",
  },
};

export default function ImageResizerPage() {
  return (
    <ToolPageLayout
      title="Image Resizer"
      description="Resize JPG, PNG and WEBP images instantly online. Change width and height, lock aspect ratio and download optimized images directly in your browser."
      href="/image-resizer"
    >
      <ImageResizerClient />
    </ToolPageLayout>
  );
}