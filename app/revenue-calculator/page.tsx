import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RevenueCalculatorClient from "./RevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Revenue Calculator | Toollane",

  description:
    "Calculate revenue from units sold and price per unit with Toollane's free online revenue calculator.",
};

const faqs = [
  {
    question: "How do you calculate revenue?",

    answer:

  },

  {
    question: "What is revenue?",

    answer:

  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function RevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Revenue Calculator"
      description="Calculate revenue from units sold and price per unit instantly online."


      href="/revenue-calculator"
      faqs={faqs}
    >
      <RevenueCalculatorClient />
    </ToolPageLayout>
  );
}