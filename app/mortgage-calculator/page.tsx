import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgageCalculatorClient from "./MortgageCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Monthly Payment & Interest | Toollane",
  description:
    "Calculate monthly mortgage payments, principal, interest, taxes, insurance, PMI, HOA fees and total repayment online with Toollane's free mortgage calculator.",


  alternates: {
    canonical: "/mortgage-calculator",
  },
};

export default function MortgageCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Calculator"
      description="Calculate monthly mortgage payments, loan amount, total interest, taxes, insurance, PMI and HOA fees with a detailed payment breakdown."
      href="/mortgage-calculator"
    >
      <MortgageCalculatorClient />
    </ToolPageLayout>
  );
}