import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RgbToHexConverterClient from "./RgbToHexConverterClient";

export const metadata: Metadata = {
  title: "RGB to HEX Converter | Toollane",
  description:
    "Convert RGB color values to HEX instantly with Toollane's free online RGB to HEX converter.",
};

const faqs = [
  {
    question: "What does an RGB to HEX converter do?",
    answer:
      "It converts red, green and blue color values into a HEX color code.",
  },
  {
    question: "What values can RGB use?",
    answer:
      "RGB values usually range from 0 to 255 for red, green and blue.",
  },
  {
    question: "Why convert RGB to HEX?",
    answer:
      "HEX color codes are commonly used in CSS, web design and design systems.",
  },
];

export default function RgbToHexConverterPage() {
  return (
    <ToolPageLayout
      title="RGB to HEX Converter"
      description="Convert RGB color values to HEX instantly online."


      href="/rgb-to-hex-converter"
      faqs={faqs}
    >
      <RgbToHexConverterClient />
    </ToolPageLayout>
  );
}