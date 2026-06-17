import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SlugGeneratorClient from "./SlugGeneratorClient";

export const metadata: Metadata = {
  title: "Slug Generator | Toollane",

  description:
    "Generate SEO-friendly URL slugs instantly with Toollane's free online slug generator.",


  alternates: {
    canonical: "/slug-generator",
  },
};

export default function SlugGeneratorPage() {
  return (
    <ToolPageLayout
      title="Slug Generator"
      description="Generate SEO-friendly URL slugs instantly online."


      href="/slug-generator"
    >
      <SlugGeneratorClient />
    </ToolPageLayout>
  );
}