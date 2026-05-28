import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomColorPaletteGeneratorClient from "./RandomColorPaletteGeneratorClient";

export const metadata: Metadata = {
  title: "Random Color Palette Generator | Toollane",

  description:
    "Generate random color palettes instantly with Toollane's free online color palette generator.",
};

const faqs = [
  {
    question: "What does a color palette generator do?",

    answer:
      "It creates sets of color codes that can be used for websites, apps, branding and design projects.",
  },

  {
    question: "Can I copy the color palette?",

    answer:

  },

  {
    question: "Who uses color palette generators?",

    answer:
      "Designers, developers, creators and marketers use color palettes for visual projects.",
  },
];

export default function RandomColorPaletteGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Color Palette Generator"
      description="Generate random color palettes instantly online."


      href="/random-color-palette-generator"
      faqs={faqs}
    >
      <RandomColorPaletteGeneratorClient />
    </ToolPageLayout>
  );
}