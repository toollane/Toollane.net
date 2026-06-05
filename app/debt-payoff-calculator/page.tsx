import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DebtPayoffCalculatorClient from "./DebtPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator | Toollane",

  description:
    "Calculate debt payoff time, total interest and total repayment with Toollane's free online debt payoff calculator.",
};

export default function DebtPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Debt Payoff Calculator"
      description="Calculate debt payoff time, total interest and repayment instantly online."


      href="/debt-payoff-calculator"
    >
      <DebtPayoffCalculatorClient />
    </ToolPageLayout>
  );
}