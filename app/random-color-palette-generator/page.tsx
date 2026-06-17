import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomColorPaletteGeneratorClient from "./RandomColorPaletteGeneratorClient";

export const metadata: Metadata = {
  title: "Random Color Palette Generator | Toollane",

  description:
    "Generate random color palettes instantly with Toollane's free online color palette generator.",


  alternates: {
    canonical: "/random-color-palette-generator",
  },
};

export default function RandomColorPaletteGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Color Palette Generator"
      description="Generate random color palettes instantly online."


      href="/random-color-palette-generator"
    >
      <RandomColorPaletteGeneratorClient />
    </ToolPageLayout>
  );
}