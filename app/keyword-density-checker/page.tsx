import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import KeywordDensityCheckerClient from "./KeywordDensityCheckerClient";

export const metadata: Metadata = {
  title: "Keyword Density Checker | Toollane",

  description:
    "Check keyword density, keyword frequency and SEO content usage instantly with Toollane's free online keyword density checker.",
};

export default function KeywordDensityCheckerPage() {
  return (
    <ToolPageLayout
      title="Keyword Density Checker"
      description="Check keyword density and keyword frequency instantly online."


      href="/keyword-density-checker"
    >
      <KeywordDensityCheckerClient />
    </ToolPageLayout>
  );
}