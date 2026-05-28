import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToPngClient from "./JpgToPngClient";

export const metadata: Metadata = {
  title: "JPG to PNG Converter | Toollane",

  description:
    "Convert JPG images to PNG instantly with Toollane's free online JPG to PNG converter.",
};

const faqs = [
  {
    question: "How does the JPG to PNG converter work?",
    answer:
      "It converts JPG image files into PNG format directly in your browser.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. The conversion happens locally in your browser, so your images are not uploaded.",
  },
  {
    question: "Why convert JPG to PNG?",
    answer:
      "PNG is useful for screenshots, graphics and images where quality or transparency support matters.",
  },
];

export default function JpgToPngPage() {
  return (
    <ToolPageLayout
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG instantly online."


      href="/jpg-to-png"
      faqs={faqs}
    >
      <JpgToPngClient />
    </ToolPageLayout>
  );
}