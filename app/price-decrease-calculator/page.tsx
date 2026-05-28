import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PriceDecreaseCalculatorClient from "./PriceDecreaseCalculatorClient";

export const metadata: Metadata = {
  title: "Price Decrease Calculator | Toollane",

  description:
    "Calculate discounts and price decreases instantly with Toollane's free online price decrease calculator.",
};

const faqs = [
  {
    question: "How do you calculate a price decrease?",

    answer:

  },

  {
    question: "How do you calculate a discounted price?",

    answer:

  },

  {
    question: "Can I enter decimal percentages?",

    answer:

  },
];

export default function PriceDecreaseCalculatorPage() {
  return (
    <ToolPageLayout
      title="Price Decrease Calculator"
      description="Calculate discounts and price decreases instantly online."


      href="/price-decrease-calculator"
      faqs={faqs}
    >
      <PriceDecreaseCalculatorClient />
    </ToolPageLayout>
  );
}