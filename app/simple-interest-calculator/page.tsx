import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SimpleInterestCalculatorClient from "./SimpleInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Simple Interest Calculator | Toollane",

  description:
    "Calculate simple interest and total amount instantly with Toollane's free online simple interest calculator.",
};

const faqs = [
  {
    question: "How do you calculate simple interest?",

    answer:
      "Simple interest is calculated by multiplying the principal amount by the interest rate and the time period.",
  },

  {
    question: "What is the difference between simple and compound interest?",

    answer:
      "Simple interest is calculated only on the original amount, while compound interest also earns interest on previous interest.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function SimpleInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest and total amount instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/simple-interest-calculator"
      faqs={faqs}
    >
      <SimpleInterestCalculatorClient />
    </ToolPageLayout>
  );
}