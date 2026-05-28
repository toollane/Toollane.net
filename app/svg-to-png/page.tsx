import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SvgToPngClient from "./SvgToPngClient";

export const metadata: Metadata = {
  title:
    "SVG to PNG Converter | Toollane",

  description:
    "Convert SVG files to PNG instantly with Toollane's free online SVG to PNG converter.",
};

const faqs = [
  {
    question:
      "How does an SVG to PNG converter work?",

    answer:

  },

  {
    question:
      "Are my SVG files uploaded?",

    answer:

  },

  {
    question:
      "Why convert SVG to PNG?",

    answer:
      "PNG is widely supported across websites, apps, forms and social media platforms.",
  },
];

export default function SvgToPngPage() {
  return (
    <ToolPageLayout
      title="SVG to PNG Converter"
      description="Convert SVG files to PNG instantly online."


      href="/svg-to-png"
      faqs={faqs}
    >
      <SvgToPngClient />
    </ToolPageLayout>
  );
}