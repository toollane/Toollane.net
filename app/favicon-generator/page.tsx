import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FaviconGeneratorClient from "./FaviconGeneratorClient";

export const metadata: Metadata = {
  title: "Favicon Generator | Toollane",

  description:
    "Create favicons instantly with Toollane's free online favicon generator.",


  alternates: {
    canonical: "/favicon-generator",
  },
};

export default function FaviconGeneratorPage() {
  return (
    <ToolPageLayout
      title="Favicon Generator"
      description="Create favicons instantly online."


      href="/favicon-generator"
    >
      <FaviconGeneratorClient />
    </ToolPageLayout>
  );
}