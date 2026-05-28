import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PngToSvgClient from "./PngToSvgClient";

export const metadata: Metadata = {
  title: "PNG to SVG Converter | Toollane",

  description:
    "Convert PNG images to SVG instantly with Toollane's free online PNG to SVG converter.",
};

const faqs = [
  {
    question:
      "What does a PNG to SVG converter do?",

    answer:
      "A PNG to SVG converter creates an SVG file from a PNG image so it can be used in websites, apps, and design projects.",
  },

  {
    question:
      "Are my images uploaded?",

    answer:

  },

  {
    question:
      "Does this vectorize the image?",

    answer:

  },
];

export default function PngToSvgPage() {
  return (
    <ToolPageLayout
      title="PNG to SVG Converter"
      description="Convert PNG images to SVG instantly online."


      href="/png-to-svg"
      faqs={faqs}
    >
      <PngToSvgClient />
    </ToolPageLayout>
  );
}