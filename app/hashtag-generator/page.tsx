import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HashtagGeneratorClient from "./HashtagGeneratorClient";

export const metadata: Metadata = {
  title:
    "Hashtag Generator | Toollane",

  description:
    "Generate trending hashtags instantly with Toollane's free online hashtag generator.",


  alternates: {
    canonical: "/hashtag-generator",
  },
};

export default function HashtagGeneratorPage() {
  return (
    <ToolPageLayout
      title="Hashtag Generator"
      description="Generate trending hashtags instantly online."


      href="/hashtag-generator"
    >
      <HashtagGeneratorClient />
    </ToolPageLayout>
  );
}