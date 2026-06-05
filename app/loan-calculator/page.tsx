import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LoanCalculatorClient from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "Loan Calculator | Toollane",

  description:
    "Calculate loan payments, total repayment and total interest instantly with Toollane's free online loan calculator.",
};

export default function LoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Loan Calculator"
      description="Calculate monthly loan payments, total repayment and interest instantly online."


      href="/loan-calculator"
    >
      <LoanCalculatorClient />
    </ToolPageLayout>
  );
}