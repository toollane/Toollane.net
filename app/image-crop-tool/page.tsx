import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCropToolClient from "./ImageCropToolClient";

export const metadata: Metadata = {
  title: "Image Crop Tool | Toollane",
  description:
    "Crop images online instantly with Toollane's free browser-based image crop tool.",
};

const faqs = [
  {
    question: "How does an image crop tool work?",
    answer:

  },
  {
    question: "Are my images uploaded?",
    answer:

  },
  {
    question: "Why crop images?",
    answer:
      "Cropping helps prepare images for profile pictures, websites, documents and social media.",
  },
];

export default function ImageCropToolPage() {
  return (
    <ToolPageLayout
      title="Image Crop Tool"
      description="Crop images instantly online."


      href="/image-crop-tool"
      faqs={faqs}
    >
      <ImageCropToolClient />
    </ToolPageLayout>
  );
}