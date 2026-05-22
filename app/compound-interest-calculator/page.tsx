import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CompoundInterestCalculatorClient from "./CompoundInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Toollane",

  description:
    "Calculate compound interest, future value, contributions and interest earned with Toollane's free online calculator.",
};

const faqs = [
  {
    question: "What is compound interest?",

    answer:
      "Compound interest is interest calculated on both the original amount and the interest that has already been earned.",
  },

  {
    question: "How do monthly contributions affect compound interest?",

    answer:
      "Monthly contributions increase the invested amount over time and can significantly increase the final balance.",
  },

  {
    question: "Why use a compound interest calculator?",

    answer:
      "A compound interest calculator helps estimate future growth, total contributions and interest earned over time.",
  },
];

export default function CompoundInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Compound Interest Calculator"
      description="Calculate compound interest, future value and investment growth instantly online."
        categoryName="Finance & Investment Tools"
        categorySlug="finance-investment-tools"
      href="/compound-interest-calculator"
      faqs={faqs}
    >
      <CompoundInterestCalculatorClient />
    </ToolPageLayout>
  );
}