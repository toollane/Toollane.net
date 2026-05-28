import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UnitPriceCalculatorClient from "./UnitPriceCalculatorClient";

export const metadata: Metadata = {
  title: "Unit Price Calculator | Toollane",

  description:
    "Calculate price per unit and compare value instantly with Toollane's free online unit price calculator.",
};

const faqs = [
  {
    question: "How do you calculate unit price?",

    answer:

  },

  {
    question: "Why use a unit price calculator?",

    answer:

  },

  {
    question: "Can I compare different package sizes?",

    answer:

  },
];

export default function UnitPriceCalculatorPage() {
  return (
    <ToolPageLayout
      title="Unit Price Calculator"
      description="Calculate price per unit and compare value instantly online."


      href="/unit-price-calculator"
      faqs={faqs}
    >
      <UnitPriceCalculatorClient />
    </ToolPageLayout>
  );
}