import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BusinessNameGeneratorClient from "./BusinessNameGeneratorClient";

export const metadata: Metadata = {
  title:
    "Business Name Generator | Toollane",

  description:
    "Generate business and startup name ideas instantly with Toollane's free online business name generator.",
};

export default function BusinessNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Business Name Generator"
      description="Generate business name ideas instantly online."


      href="/business-name-generator"
    >
      <BusinessNameGeneratorClient />
    </ToolPageLayout>
  );
}