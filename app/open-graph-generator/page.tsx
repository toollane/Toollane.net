import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import OpenGraphGeneratorClient from "./OpenGraphGeneratorClient";

export const metadata: Metadata = {
  title:
    "Open Graph Generator | Toollane",

  description:
    "Generate Open Graph meta tags instantly with Toollane's free online Open Graph generator.",


  alternates: {
    canonical: "/open-graph-generator",
  },
};

export default function OpenGraphGeneratorPage() {
  return (
    <ToolPageLayout
      title="Open Graph Generator"
      description="Generate Open Graph meta tags instantly online."


      href="/open-graph-generator"
    >
      <OpenGraphGeneratorClient />
    </ToolPageLayout>
  );
}