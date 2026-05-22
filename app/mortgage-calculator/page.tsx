import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgageCalculatorClient from "./MortgageCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Toollane",

  description:
    "Calculate mortgage payments, loan amount, total interest and total repayment with Toollane's free online mortgage calculator.",
};

const faqs = [
  {
    question: "How do you calculate a mortgage payment?",

    answer:
      "A mortgage payment is calculated using the loan amount, interest rate and loan term. The payment is usually spread across monthly installments.",
  },

  {
    question: "Does this mortgage calculator include taxes and insurance?",

    answer:
      "No. This calculator estimates principal and interest only. Property taxes, insurance and local fees are not included.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function MortgageCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Calculator"
      description="Calculate mortgage payments, loan amount and total interest instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/mortgage-calculator"
      faqs={faqs}
    >
      <MortgageCalculatorClient />
    </ToolPageLayout>
  );
}