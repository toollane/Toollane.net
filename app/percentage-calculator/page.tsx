import type { Metadata } from "next";

import PercentageCalculatorClient from "./PercentageCalculatorClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Percentage Calculator | Toollane",
  description:
    "Calculate percentages, percentage increases and percentage decreases instantly with Toollane's free online percentage calculator.",
};

const faqs = [
  {
    question: "How do you calculate a percentage of a number?",
    answer:
      "To calculate a percentage of a number, divide the percentage by 100 and multiply it by the number.",
  },
  {
    question: "How do you calculate percentage increase?",
    answer:
      "To calculate percentage increase, subtract the old value from the new value, divide the result by the old value, and multiply by 100.",
  },
  {
    question: "How do you calculate percentage decrease?",
    answer:
      "To calculate percentage decrease, subtract the new value from the old value, divide the result by the old value, and multiply by 100.",
  },
];

export default function PercentageCalculatorPage() {
  return (
    <ToolPageLayout
      title="Percentage Calculator"
      description="Calculate percentages, percentage increases and percentage decreases instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/percentage-calculator"
      faqs={faqs}
    >
      <PercentageCalculatorClient />
    </ToolPageLayout>
  );
}