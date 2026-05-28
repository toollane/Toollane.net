import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarginMarkupCalculatorClient from "./MarginMarkupCalculatorClient";

export const metadata: Metadata = {
  title:
    "Margin & Markup Calculator | Toollane",

  description:
    "Calculate profit margin and markup instantly with Toollane's free online calculator.",
};

const faqs = [
  {
    question:
      "What is profit margin?",

    answer:

  },

  {
    question:
      "What is markup?",

    answer:

  },

  {
    question:
      "Why are margin and markup different?",

    answer:

  },
];

export default function MarginMarkupCalculatorPage() {
  return (
    <ToolPageLayout
      title="Margin & Markup Calculator"
      description="Calculate profit margin, markup and profit instantly online."


      href="/margin-markup-calculator"
      faqs={faqs}
    >
      <MarginMarkupCalculatorClient />
    </ToolPageLayout>
  );
}