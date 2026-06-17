import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LinkInBioGeneratorClient from "./LinkInBioGeneratorClient";

export const metadata: Metadata = {
  title:
    "Link in Bio Generator | Toollane",

  description:
    "Create mobile link hub pages instantly with Toollane's free online link in bio generator.",


  alternates: {
    canonical: "/link-in-bio-generator",
  },
};

export default function LinkInBioGeneratorPage() {
  return (
    <ToolPageLayout
      title="Link in Bio Generator"
      description="Create mobile link hub pages instantly online."


      href="/link-in-bio-generator"
    >
      <LinkInBioGeneratorClient />
    </ToolPageLayout>
  );
}