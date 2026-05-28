import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import OpenGraphGeneratorClient from "./OpenGraphGeneratorClient";

export const metadata: Metadata = {
  title:
    "Open Graph Generator | Toollane",

  description:
    "Generate Open Graph meta tags instantly with Toollane's free online Open Graph generator.",
};

const faqs = [
  {
    question:
      "What does an Open Graph generator do?",

    answer:

  },

  {
    question:
      "Why are Open Graph tags important?",

    answer:

  },

  {
    question:
      "Who uses Open Graph generators?",

    answer:
      "SEO specialists, developers, bloggers and marketers use Open Graph generators.",
  },
];

export default function OpenGraphGeneratorPage() {
  return (
    <ToolPageLayout
      title="Open Graph Generator"
      description="Generate Open Graph meta tags instantly online."


      href="/open-graph-generator"
      faqs={faqs}
    >
      <OpenGraphGeneratorClient />
    </ToolPageLayout>
  );
}