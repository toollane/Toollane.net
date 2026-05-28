import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HeicToJpgClient from "./HeicToJpgClient";

export const metadata: Metadata = {
  title:
    "HEIC to JPG Converter | Toollane",

  description:
    "Convert HEIC images to JPG instantly with Toollane's free online HEIC to JPG converter.",
};

const faqs = [
  {
    question:
      "What is a HEIC file?",

    answer:
      "HEIC is Apple's image format used by iPhones and iPads for photos.",
  },

  {
    question:
      "Why convert HEIC to JPG?",

    answer:
      "JPG files are more widely supported by websites, apps, forms and email providers.",
  },

  {
    question:
      "Are my HEIC files uploaded?",

    answer:

  },
];

export default function HeicToJpgPage() {
  return (
    <ToolPageLayout
      title="HEIC to JPG Converter"
      description="Convert HEIC images to JPG instantly online."


      href="/heic-to-jpg"
      faqs={faqs}
    >
      <HeicToJpgClient />
    </ToolPageLayout>
  );
}