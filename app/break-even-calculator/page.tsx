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

  },

  {
    question: "How do you calculate break-even units?",

    answer:

  },

  {
    question: "What is contribution margin?",

    answer:

  },
];

export default function BreakEvenCalculatorPage() {
  return (
    <ToolPageLayout
      title="Break-Even Calculator"
      description="Calculate break-even units, revenue and contribution margin instantly online."


      href="/break-even-calculator"
      faqs={faqs}
    >
      <BreakEvenCalculatorClient />
    </ToolPageLayout>
  );
}