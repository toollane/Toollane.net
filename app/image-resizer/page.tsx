import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Image Resizer | Toollane",

  description:
    "Resize images online instantly with Toollane's free browser-based image resizer.",
};

const faqs = [
  {
    question: "How does an image resizer work?",

    answer:

  },

  {
    question: "Are my images uploaded?",

    answer:

  },

  {
    question: "Why resize images?",

    answer:
      "Resizing images helps prepare files for websites, social media, documents and online forms.",
  },
];

export default function ImageResizerPage() {
  return (
    <ToolPageLayout
      title="Image Resizer"
      description="Resize images instantly online."


      href="/image-resizer"
      faqs={faqs}
    >
      <ImageResizerClient />
    </ToolPageLayout>
  );
}