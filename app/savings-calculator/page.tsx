import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SavingsCalculatorClient from "./SavingsCalculatorClient";

export const metadata: Metadata = {
  title: "Savings Calculator | Toollane",

  description:
    "Calculate how much you can save over time with Toollane's free online savings calculator.",
};

const faqs = [
  {
    question: "How does a savings calculator work?",

    answer:
      "A savings calculator estimates your future savings by adding your starting amount and regular monthly savings over a chosen time period.",
  },

  {
    question: "Can I use this savings calculator for monthly savings?",

    answer:
      "Yes. Enter your monthly savings amount and the calculator will estimate how much you can save over time.",
  },

  {
    question: "Does this savings calculator include interest?",

    answer:
      "This simple savings calculator focuses on contributions only. For interest growth, use a compound interest calculator.",
  },
];

export default function SavingsCalculatorPage() {
  return (
    <ToolPageLayout
      title="Savings Calculator"
      description="Calculate how much you can save over time instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/savings-calculator"
      faqs={faqs}
    >
      <SavingsCalculatorClient />
    </ToolPageLayout>
  );
}