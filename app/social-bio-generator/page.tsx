import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SocialBioGeneratorClient from "./SocialBioGeneratorClient";

export const metadata: Metadata = {
  title: "Social Bio Generator | Toollane",

  description:
    "Generate social media bio ideas instantly with Toollane's free online bio generator.",
};

export default function SocialBioGeneratorPage() {
  return (
    <ToolPageLayout
      title="Social Bio Generator"
      description="Generate social media bio ideas instantly online."


      href="/social-bio-generator"
    >
      <SocialBioGeneratorClient />
    </ToolPageLayout>
  );
}