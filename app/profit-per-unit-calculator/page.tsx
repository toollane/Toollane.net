import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ProfitPerUnitCalculatorClient from "./ProfitPerUnitCalculatorClient";

export const metadata: Metadata = {
  title: "Profit Per Unit Calculator | Toollane",

  description:
    "Calculate profit per unit, total profit and margin with Toollane's free online profit per unit calculator.",
};

const faqs = [
  {
    question: "How do you calculate profit per unit?",

    answer:

  },

  {
    question: "How do you calculate total profit?",

    answer:

  },

  {
    question: "Why use a profit per unit calculator?",

    answer:
      "It helps sellers, creators and businesses understand product profitability before scaling sales.",
  },
];

export default function ProfitPerUnitCalculatorPage() {
  return (
    <ToolPageLayout
      title="Profit Per Unit Calculator"
      description="Calculate profit per unit, total profit and margin instantly online."


      href="/profit-per-unit-calculator"
      faqs={faqs}
    >
      <ProfitPerUnitCalculatorClient />
    </ToolPageLayout>
  );
}