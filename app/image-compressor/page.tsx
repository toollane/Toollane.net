import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Image Compressor | Toollane",

  description:
    "Compress images online instantly with Toollane's free browser-based image compressor.",
};

const faqs = [
  {
    question: "How does an image compressor work?",

    answer:

  },

  {
    question: "Are my images uploaded?",

    answer:

  },

  {
    question: "Why compress images?",

    answer:
      "Compressed images load faster and are easier to upload to websites, forms and applications.",
  },
];

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Compress images instantly online."


      href="/image-compressor"
      faqs={faqs}
    >
      <ImageCompressorClient />
    </ToolPageLayout>
  );
}