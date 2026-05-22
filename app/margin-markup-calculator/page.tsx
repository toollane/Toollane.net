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
      "Profit margin measures how much profit remains after costs compared to the selling price.",
  },

  {
    question:
      "What is markup?",

    answer:
      "Markup measures how much the selling price exceeds the original cost.",
  },

  {
    question:
      "Why are margin and markup different?",

    answer:
      "Margin is based on selling price while markup is based on cost price.",
  },
];

export default function MarginMarkupCalculatorPage() {
  return (
    <ToolPageLayout
      title="Margin & Markup Calculator"
      description="Calculate profit margin, markup and profit instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/margin-markup-calculator"
      faqs={faqs}
    >
      <MarginMarkupCalculatorClient />
    </ToolPageLayout>
  );
}