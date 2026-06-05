import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SloganGeneratorClient from "./SloganGeneratorClient";

export const metadata: Metadata = {
  title: "Slogan Generator | Toollane",

  description:
    "Generate slogan ideas instantly with Toollane's free online slogan generator.",
};

export default function SloganGeneratorPage() {
  return (
    <ToolPageLayout
      title="Slogan Generator"
      description="Generate slogan ideas instantly online."


      href="/slogan-generator"
    >
      <SloganGeneratorClient />
    </ToolPageLayout>
  );
}