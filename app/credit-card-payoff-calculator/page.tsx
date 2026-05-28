import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CreditCardPayoffCalculatorClient from "./CreditCardPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator | Toollane",

  description:
    "Calculate credit card payoff time, total interest and total repayment with Toollane's free online calculator.",
};

const faqs = [
  {
    question: "How does a credit card payoff calculator work?",

    answer:

  },

  {
    question: "Why does credit card interest matter?",

    answer:

  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function CreditCardPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Credit Card Payoff Calculator"
      description="Calculate payoff time, total interest and repayment instantly online."


      href="/credit-card-payoff-calculator"
      faqs={faqs}
    >
      <CreditCardPayoffCalculatorClient />
    </ToolPageLayout>
  );
}