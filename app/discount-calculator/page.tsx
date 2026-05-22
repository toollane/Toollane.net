import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DiscountCalculatorClient from "./DiscountCalculatorClient";

export const metadata: Metadata = {
  title: "Discount Calculator | Toollane",

  description:
    "Calculate discounts, savings and final prices instantly with Toollane's free online discount calculator.",
};

const faqs = [
  {
    question: "How do you calculate a discount?",

    answer:
      "To calculate a discount, multiply the original price by the discount percentage divided by 100.",
  },

  {
    question: "How do you calculate the final price after a discount?",

    answer:
      "Subtract the discount amount from the original price to get the final price.",
  },

  {
    question: "Why use a discount calculator?",

    answer:
      "A discount calculator helps you quickly see how much you save and what the final price will be.",
  },
];

export default function DiscountCalculatorPage() {
  return (
    <ToolPageLayout
      title="Discount Calculator"
      description="Calculate discounts, savings and final prices instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/discount-calculator"
      faqs={faqs}
    >
      <DiscountCalculatorClient />
    </ToolPageLayout>
  );
}