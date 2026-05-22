import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AutoLoanCalculatorClient from "./AutoLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Auto Loan Calculator | Toollane",

  description:
    "Calculate car loan payments, total repayment and interest instantly with Toollane's free online auto loan calculator.",
};

const faqs = [
  {
    question: "How do you calculate an auto loan payment?",

    answer:
      "An auto loan payment is calculated using the vehicle price, down payment, interest rate and loan term.",
  },

  {
    question: "What is total interest on an auto loan?",

    answer:
      "Total interest is the amount paid above the borrowed loan amount over the full repayment period.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function AutoLoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Auto Loan Calculator"
      description="Calculate car loan payments and total interest instantly online."
      categoryName="Finance & Investment Tools"
      categorySlug="finance-investment-tools"
      href="/auto-loan-calculator"
      faqs={faqs}
    >
      <AutoLoanCalculatorClient />
    </ToolPageLayout>
  );
}