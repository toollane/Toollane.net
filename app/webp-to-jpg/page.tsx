import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WebpToJpgClient from "./WebpToJpgClient";

export const metadata: Metadata = {
  title: "WEBP to JPG Converter | Toollane",
  description:
    "Convert WEBP images to JPG instantly with Toollane's free online WEBP to JPG converter.",
};

const faqs = [
  {
    question: "How does a WEBP to JPG converter work?",
    answer:

  },
  {
    question: "Are my images uploaded?",
    answer:

  },
  {
    question: "Why convert WEBP to JPG?",
    answer:
      "JPG is widely supported by apps, websites, forms and older systems.",
  },
];

export default function WebpToJpgPage() {
  return (
    <ToolPageLayout
      title="WEBP to JPG Converter"
      description="Convert WEBP images to JPG instantly online."


      href="/webp-to-jpg"
      faqs={faqs}
    >
      <WebpToJpgClient />
    </ToolPageLayout>
  );
}