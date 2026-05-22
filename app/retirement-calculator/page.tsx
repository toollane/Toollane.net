import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RetirementCalculatorClient from "./RetirementCalculatorClient";

export const metadata: Metadata = {
  title: "Retirement Calculator | Toollane",

  description:
    "Estimate retirement savings, future balance, contributions and investment growth with Toollane's free online retirement calculator.",
};

const faqs = [
  {
    question: "How does a retirement calculator work?",

    answer:
      "A retirement calculator estimates future savings based on your current savings, monthly contributions, expected return and years until retirement.",
  },

  {
    question: "Does this calculator include inflation or taxes?",

    answer:
      "No. This is a simplified retirement savings estimate and does not include inflation, taxes, fees or withdrawals.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function RetirementCalculatorPage() {
  return (
    <ToolPageLayout
      title="Retirement Calculator"
      description="Estimate retirement savings and future investment growth instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/retirement-calculator"
      faqs={faqs}
    >
      <RetirementCalculatorClient />
    </ToolPageLayout>
  );
}