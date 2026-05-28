import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ImageFlipToolClient from "./ImageFlipToolClient";

export const metadata: Metadata = {
  title: "Image Flip Tool | Toollane",

  description:
    "Flip images horizontally or vertically instantly with Toollane's free online image flip tool.",
};

const faqs = [
  {
    question: "What does an image flip tool do?",

    answer:

  },

  {
    question: "Are my images uploaded?",

    answer:

  },

  {
    question: "Why flip images?",

    answer:
      "Flipping images is useful for profile pictures, design work, printing and social media editing.",
  },
];

export default function ImageFlipToolPage() {
  return (
    <ToolPageLayout
      title="Image Flip Tool"
      description="Flip images horizontally or vertically instantly online."


      href="/image-flip-tool"
      faqs={faqs}
    >
      <ImageFlipToolClient />
    </ToolPageLayout>
  );
}