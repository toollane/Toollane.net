import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CreditCardPayoffCalculatorClient from "./CreditCardPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator | Interest & Time | Toollane",
  description:
    "Calculate credit card payoff time, total interest, monthly payments, interest saved and payoff timeline with Toollane's free online credit card payoff calculator.",


  alternates: {
    canonical: "/credit-card-payoff-calculator",
  },
};

export default function CreditCardPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Credit Card Payoff Calculator"
      description="Calculate credit card payoff time, total interest, monthly payments, interest saved and repayment timeline instantly online."
      href="/credit-card-payoff-calculator"
    >
      <CreditCardPayoffCalculatorClient />
    </ToolPageLayout>
  );
}