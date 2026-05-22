import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TipCalculatorClient from "./TipCalculatorClient";

export const metadata: Metadata = {
  title: "Tip Calculator | Toollane",

  description:
    "Calculate tips, totals and split bills instantly with Toollane's free online tip calculator.",
};

const faqs = [
  {
    question: "How do you calculate a tip?",

    answer:
      "To calculate a tip, multiply the bill amount by the tip percentage divided by 100.",
  },

  {
    question: "How do you split a bill with tip?",

    answer:
      "Add the tip amount to the bill total, then divide the result by the number of people.",
  },

  {
    question: "Why use a tip calculator?",

    answer:
      "A tip calculator helps you quickly calculate tips, totals and per-person amounts without manual math.",
  },
];

export default function TipCalculatorPage() {
  return (
    <ToolPageLayout
      title="Tip Calculator"
      description="Calculate tips, totals and split bills instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/tip-calculator"
      faqs={faqs}
    >
      <TipCalculatorClient />
    </ToolPageLayout>
  );
}