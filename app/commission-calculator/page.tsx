import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CommissionCalculatorClient from "./CommissionCalculatorClient";

export const metadata: Metadata = {
  title: "Commission Calculator | Toollane",

  description:
    "Calculate sales commission instantly with Toollane's free online commission calculator.",
};

const faqs = [
  {
    question: "How do you calculate commission?",

    answer:

  },

  {
    question: "What is a commission rate?",

    answer:

  },

  {
    question: "Can I enter decimal commission rates?",

    answer:

  },
];

export default function CommissionCalculatorPage() {
  return (
    <ToolPageLayout
      title="Commission Calculator"
      description="Calculate sales commission instantly online."


      href="/commission-calculator"
      faqs={faqs}
    >
      <CommissionCalculatorClient />
    </ToolPageLayout>
  );
}