import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DebtPayoffCalculatorClient from "./DebtPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator | Toollane",

  description:
    "Calculate debt payoff time, total interest and total repayment with Toollane's free online debt payoff calculator.",
};

const faqs = [
  {
    question: "How does a debt payoff calculator work?",

    answer:
      "A debt payoff calculator estimates how long it takes to pay off debt using your balance, interest rate and monthly payment.",
  },

  {
    question: "Why does interest affect debt payoff time?",

    answer:
      "Interest increases the amount you owe over time, so higher interest rates can make debt take longer to repay.",
  },

  {
    question: "Can I use different currencies?",

    answer:
      "Yes. You can choose common currencies such as USD, EUR, GBP, CAD and AUD.",
  },
];

export default function DebtPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Debt Payoff Calculator"
      description="Calculate debt payoff time, total interest and repayment instantly online."


      href="/debt-payoff-calculator"
      faqs={faqs}
    >
      <DebtPayoffCalculatorClient />
    </ToolPageLayout>
  );
}