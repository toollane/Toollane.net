import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BreakEvenCalculatorClient from "./BreakEvenCalculatorClient";

export const metadata: Metadata = {
  title: "Break-Even Calculator | Toollane",

  description:
    "Calculate break-even units, break-even revenue and contribution margin with Toollane's free online break-even calculator.",
};

const faqs = [
  {
    question: "What is a break-even point?",

    answer:
      "The break-even point is the number of units you need to sell to cover all fixed and variable costs.",
  },

  {
    question: "How do you calculate break-even units?",

    answer:
      "Break-even units are calculated by dividing fixed costs by contribution margin per unit.",
  },

  {
    question: "What is contribution margin?",

    answer:
      "Contribution margin is the selling price per unit minus the variable cost per unit.",
  },
];

export default function BreakEvenCalculatorPage() {
  return (
    <ToolPageLayout
      title="Break-Even Calculator"
      description="Calculate break-even units, revenue and contribution margin instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/break-even-calculator"
      faqs={faqs}
    >
      <BreakEvenCalculatorClient />
    </ToolPageLayout>
  );
}