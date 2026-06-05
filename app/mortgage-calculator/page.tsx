import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgageCalculatorClient from "./MortgageCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Toollane",

  description:
    "Calculate mortgage payments, loan amount, total interest and total repayment with Toollane's free online mortgage calculator.",
};

export default function MortgageCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Calculator"
      description="Calculate mortgage payments, loan amount and total interest instantly online."


      href="/mortgage-calculator"
    >
      <MortgageCalculatorClient />
    </ToolPageLayout>
  );
}