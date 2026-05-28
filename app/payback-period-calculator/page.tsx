import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PaybackPeriodCalculatorClient from "./PaybackPeriodCalculatorClient";

export const metadata: Metadata = {
  title: "Payback Period Calculator | Toollane",

  description:
    "Calculate payback period in years and months with Toollane's free online payback period calculator.",
};

const faqs = [
  {
    question: "What is payback period?",

    answer:

  },

  {
    question: "How do you calculate payback period?",

    answer:

  },

  {
    question: "Why use a payback period calculator?",

    answer:

  },
];

export default function PaybackPeriodCalculatorPage() {
  return (
    <ToolPageLayout
      title="Payback Period Calculator"
      description="Calculate how long it takes to recover an investment instantly online."


      href="/payback-period-calculator"
      faqs={faqs}
    >
      <PaybackPeriodCalculatorClient />
    </ToolPageLayout>
  );
}