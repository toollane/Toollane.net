import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CreditCardPayoffCalculatorClient from "./CreditCardPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator | Toollane",

  description:
    "Calculate credit card payoff time, total interest and total repayment with Toollane's free online calculator.",
};

export default function CreditCardPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Credit Card Payoff Calculator"
      description="Calculate payoff time, total interest and repayment instantly online."


      href="/credit-card-payoff-calculator"
    >
      <CreditCardPayoffCalculatorClient />
    </ToolPageLayout>
  );
}