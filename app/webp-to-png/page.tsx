import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WebpToPngClient from "./WebpToPngClient";

export const metadata: Metadata = {
  title: "WEBP to PNG Converter | Toollane",
  description:
    "Convert WEBP images to PNG instantly with Toollane's free online WEBP to PNG converter.",
};

const faqs = [
  {
    question: "How does a WEBP to PNG converter work?",
    answer:

  },
  {
    question: "Are my images uploaded?",
    answer:

  },
  {
    question: "Why convert WEBP to PNG?",
    answer:
      "PNG is widely used for graphics, screenshots and images that may need transparency.",
  },
];

export default function WebpToPngPage() {
  return (
    <ToolPageLayout
      title="WEBP to PNG Converter"
      description="Convert WEBP images to PNG instantly online."


      href="/webp-to-png"
      faqs={faqs}
    >
      <WebpToPngClient />
    </ToolPageLayout>
  );
}