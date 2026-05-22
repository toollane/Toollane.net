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
      "Payback period is the time it takes to recover an initial investment through expected cash flow.",
  },

  {
    question: "How do you calculate payback period?",

    answer:
      "Payback period is calculated by dividing the initial investment by annual cash flow.",
  },

  {
    question: "Why use a payback period calculator?",

    answer:
      "A payback period calculator helps estimate how long an investment may take to pay for itself.",
  },
];

export default function PaybackPeriodCalculatorPage() {
  return (
    <ToolPageLayout
      title="Payback Period Calculator"
      description="Calculate how long it takes to recover an investment instantly online."
      categoryName="Business & Pricing Calculators"
      categorySlug="business-pricing-calculators"
      href="/payback-period-calculator"
      faqs={faqs}
    >
      <PaybackPeriodCalculatorClient />
    </ToolPageLayout>
  );
}