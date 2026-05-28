import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HexRgbConverterClient from "./HexRgbConverterClient";

export const metadata: Metadata = {
  title: "HEX to RGB Converter | Toollane",

  description:
    "Convert HEX color codes to RGB instantly with Toollane's free online HEX to RGB converter.",
};

const faqs = [
  {
    question: "What does a HEX to RGB converter do?",

    answer:

  },

  {
    question: "What is a HEX color code?",

    answer:

  },

  {
    question: "Why convert HEX to RGB?",

    answer:
      "RGB values are useful for CSS, design systems, transparency effects and color editing.",
  },
];

export default function HexRgbConverterPage() {
  return (
    <ToolPageLayout
      title="HEX to RGB Converter"
      description="Convert HEX color codes to RGB instantly online."


      href="/hex-rgb-converter"
      faqs={faqs}
    >
      <HexRgbConverterClient />
    </ToolPageLayout>
  );
}