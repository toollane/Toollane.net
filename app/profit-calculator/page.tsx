import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ProfitCalculatorClient from "./ProfitCalculatorClient";

export const metadata: Metadata = {
  title: "Profit Calculator | Toollane",

  description:
    "Calculate profit and profit margin instantly with Toollane's free online profit calculator.",
};

const faqs = [
  {
    question: "How do you calculate profit?",

    answer:
      "Profit is calculated by subtracting total costs from total revenue.",
  },

  {
    question: "How do you calculate profit margin?",

    answer:
      "Profit margin is calculated by dividing profit by revenue and multiplying the result by 100.",
  },

  {
    question: "Why use a profit calculator?",

    answer:
      "A profit calculator helps businesses quickly estimate profitability from revenue and costs.",
  },
];

export default function ProfitCalculatorPage() {
  return (
    <ToolPageLayout
      title="Profit Calculator"
      description="Calculate profit and profit margin instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/profit-calculator"
      faqs={faqs}
    >
      <ProfitCalculatorClient />
    </ToolPageLayout>
  );
}