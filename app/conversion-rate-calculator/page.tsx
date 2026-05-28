import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ConversionRateCalculatorClient from "./ConversionRateCalculatorClient";

export const metadata: Metadata = {
  title: "Conversion Rate Calculator | Toollane",

  description:
    "Calculate conversion rate instantly with Toollane's free online conversion rate calculator.",
};

const faqs = [
  {
    question: "How do you calculate conversion rate?",

    answer:

  },

  {
    question: "What is a good conversion rate?",

    answer:
      "A good conversion rate depends on the industry, traffic source and offer. Comparing changes over time is often more useful than a fixed benchmark.",
  },

  {
    question: "Why use a conversion rate calculator?",

    answer:
      "A conversion rate calculator helps marketers, creators and businesses measure how effectively traffic turns into actions.",
  },
];

export default function ConversionRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Conversion Rate Calculator"
      description="Calculate conversion rate instantly online."


      href="/conversion-rate-calculator"
      faqs={faqs}
    >
      <ConversionRateCalculatorClient />
    </ToolPageLayout>
  );
}