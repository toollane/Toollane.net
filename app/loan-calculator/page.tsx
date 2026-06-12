import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LoanCalculatorClient from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Loan Calculator | Monthly Payment & Interest | Toollane",
  description:
    "Calculate monthly loan payments, total interest, total repayment and payoff time online with Toollane's free loan calculator.",
};

export default function LoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Loan Calculator"
      description="Calculate monthly loan payments, total repayment, total interest and payoff time. Add extra monthly payments to see how much time and interest you could save."
      href="/loan-calculator"
    >
      <LoanCalculatorClient />
    </ToolPageLayout>
  );
}