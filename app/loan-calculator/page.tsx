import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LoanCalculatorClient from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Loan Calculator | Toollane",

  description:
    "Calculate loan payments, total repayment and total interest instantly with Toollane's free online loan calculator.",
};

const faqs = [
  {
    question: "How do you calculate monthly loan payments?",

    answer:
      "Monthly loan payments are calculated using the loan amount, interest rate and repayment term.",
  },

  {
    question: "What does total interest mean?",

    answer:
      "Total interest is the amount paid above the original loan amount over the full repayment period.",
  },

  {
    question: "Can I use this loan calculator with different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function LoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Loan Calculator"
      description="Calculate monthly loan payments, total repayment and interest instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/loan-calculator"
      faqs={faqs}
    >
      <LoanCalculatorClient />
    </ToolPageLayout>
  );
}