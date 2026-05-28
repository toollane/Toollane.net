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

  },

  {
    question: "How do you calculate profit margin?",

    answer:

  },

  {
    question: "Why use a profit calculator?",

    answer:

  },
];

export default function ProfitCalculatorPage() {
  return (
    <ToolPageLayout
      title="Profit Calculator"
      description="Calculate profit and profit margin instantly online."


      href="/profit-calculator"
      faqs={faqs}
    >
      <ProfitCalculatorClient />
    </ToolPageLayout>
  );
}