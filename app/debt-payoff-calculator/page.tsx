import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DebtPayoffCalculatorClient from "./DebtPayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator | Snowball & Avalanche | Toollane",
  description:
    "Calculate debt payoff time, total interest, payoff order and compare debt snowball vs avalanche strategies with Toollane's free online debt payoff calculator.",
};

export default function DebtPayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Debt Payoff Calculator"
      description="Calculate debt payoff time, total interest, payoff order and compare snowball vs avalanche repayment strategies."
      href="/debt-payoff-calculator"
    >
      <DebtPayoffCalculatorClient />
    </ToolPageLayout>
  );
}