import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BoxShadowGeneratorClient from "./BoxShadowGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator | Toollane",

  description:
    "Create CSS box shadows visually with Toollane's free online box shadow generator.",


  alternates: {
    canonical: "/box-shadow-generator",
  },
};

export default function BoxShadowGeneratorPage() {
  return (
    <ToolPageLayout
      title="CSS Box Shadow Generator"
      description="Create CSS box shadows visually online."


      href="/box-shadow-generator"
    >
      <BoxShadowGeneratorClient />
    </ToolPageLayout>
  );
}