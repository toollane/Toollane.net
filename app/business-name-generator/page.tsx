import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BusinessNameGeneratorClient from "./BusinessNameGeneratorClient";

export const metadata: Metadata = {
  title:
    "Business Name Generator | Toollane",

  description:
    "Generate business and startup name ideas instantly with Toollane's free online business name generator.",
};

const faqs = [
  {
    question:
      "What does a business name generator do?",

    answer:

  },

  {
    question:
      "Who uses business name generators?",

    answer:
      "Entrepreneurs, creators, agencies and startups use them to brainstorm brand names.",
  },

  {
    question:
      "Can I use my own keyword?",

    answer:

  },
];

export default function BusinessNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Business Name Generator"
      description="Generate business name ideas instantly online."


      href="/business-name-generator"
      faqs={faqs}
    >
      <BusinessNameGeneratorClient />
    </ToolPageLayout>
  );
}