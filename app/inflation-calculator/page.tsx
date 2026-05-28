import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InflationCalculatorClient from "./InflationCalculatorClient";

export const metadata: Metadata = {
  title: "Inflation Calculator | Toollane",

  description:
    "Calculate future cost and price increase from inflation with Toollane's free online inflation calculator.",
};

const faqs = [
  {
    question: "How does an inflation calculator work?",

    answer:

  },

  {
    question: "What does inflation do to purchasing power?",

    answer:
      "Inflation means prices rise over time, so the same amount of money may buy less in the future.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function InflationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Inflation Calculator"
      description="Estimate future cost and inflation impact instantly online."


      href="/inflation-calculator"
      faqs={faqs}
    >
      <InflationCalculatorClient />
    </ToolPageLayout>
  );
}