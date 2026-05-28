import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToWebpClient from "./JpgToWebpClient";

export const metadata: Metadata = {
  title: "JPG to WEBP Converter | Toollane",
  description:
    "Convert JPG images to WEBP instantly with Toollane's free online JPG to WEBP converter.",
};

const faqs = [
  {
    question: "How does a JPG to WEBP converter work?",
    answer:

  },
  {
    question: "Are my images uploaded?",
    answer:

  },
  {
    question: "Why convert JPG to WEBP?",
    answer:

  },
];

export default function JpgToWebpPage() {
  return (
    <ToolPageLayout
      title="JPG to WEBP Converter"
      description="Convert JPG images to WEBP instantly online."


      href="/jpg-to-webp"
      faqs={faqs}
    >
      <JpgToWebpClient />
    </ToolPageLayout>
  );
}