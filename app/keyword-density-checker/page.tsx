import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import KeywordDensityCheckerClient from "./KeywordDensityCheckerClient";

export const metadata: Metadata = {
  title: "Keyword Density Checker | Toollane",

  description:
    "Check keyword density, keyword frequency and SEO content usage instantly with Toollane's free online keyword density checker.",
};

const faqs = [
  {
    question: "What is keyword density?",

    answer:

  },

  {
    question: "How do you calculate keyword density?",

    answer:

  },

  {
    question: "Why use a keyword density checker?",

    answer:
      "A keyword density checker helps writers, marketers and SEO specialists review content for keyword usage.",
  },
];

export default function KeywordDensityCheckerPage() {
  return (
    <ToolPageLayout
      title="Keyword Density Checker"
      description="Check keyword density and keyword frequency instantly online."


      href="/keyword-density-checker"
      faqs={faqs}
    >
      <KeywordDensityCheckerClient />
    </ToolPageLayout>
  );
}