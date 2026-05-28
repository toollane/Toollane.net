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

  },

  {
    question: "Why use a discount calculator?",

    answer:

  },
];

export default function DiscountCalculatorPage() {
  return (
    <ToolPageLayout
      title="Discount Calculator"
      description="Calculate discounts, savings and final prices instantly online."


      href="/discount-calculator"
      faqs={faqs}
    >
      <DiscountCalculatorClient />
    </ToolPageLayout>
  );
}