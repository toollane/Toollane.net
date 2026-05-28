import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PriceIncreaseCalculatorClient from "./PriceIncreaseCalculatorClient";

export const metadata: Metadata = {
  title: "Price Increase Calculator | Toollane",

  description:
    "Calculate price increase amount and new price instantly with Toollane's free online price increase calculator.",
};

const faqs = [
  {
    question: "How do you calculate a price increase?",

    answer:

  },

  {
    question: "How do you calculate the new price?",

    answer:

  },

  {
    question: "Can I enter decimal percentages?",

    answer:

  },
];

export default function PriceIncreaseCalculatorPage() {
  return (
    <ToolPageLayout
      title="Price Increase Calculator"
      description="Calculate price increase amount and new price instantly online."


      href="/price-increase-calculator"
      faqs={faqs}
    >
      <PriceIncreaseCalculatorClient />
    </ToolPageLayout>
  );
}