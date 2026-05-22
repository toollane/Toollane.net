import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InvestmentCalculatorClient from "./InvestmentCalculatorClient";

export const metadata: Metadata = {
  title:
    "Investment Calculator | Toollane",

  description:
    "Calculate investment growth, future value and recurring contributions instantly with Toollane's free online investment calculator.",
};

const faqs = [
  {
    question:
      "How does an investment calculator work?",

    answer:
      "An investment calculator estimates future portfolio growth using contributions, expected returns and investment duration.",
  },

  {
    question:
      "What is compound investment growth?",

    answer:
      "Compound growth means investment returns can generate additional returns over time.",
  },

  {
    question:
      "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function InvestmentCalculatorPage() {
  return (
    <ToolPageLayout
      title="Investment Calculator"
      description="Calculate investment growth and future portfolio value instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/investment-calculator"
      faqs={faqs}
    >
      <InvestmentCalculatorClient />
    </ToolPageLayout>
  );
}