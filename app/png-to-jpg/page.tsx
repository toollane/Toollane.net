import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToJpgClient from "./PngToJpgClient";

export const metadata: Metadata = {
  title: "PNG to JPG Converter | Toollane",

  description:
    "Convert PNG images to JPG instantly with Toollane's free online PNG to JPG converter.",
};

const faqs = [
  {
    question: "How does a PNG to JPG converter work?",

    answer:

  },

  {
    question: "Are my images uploaded?",

    answer:

  },

  {
    question: "Why convert PNG to JPG?",

    answer:
      "JPG files are often smaller and easier to use for websites, email and documents.",
  },
];

export default function PngToJpgPage() {
  return (
    <ToolPageLayout
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG instantly online."


      href="/png-to-jpg"
      faqs={faqs}
    >
      <PngToJpgClient />
    </ToolPageLayout>
  );
}