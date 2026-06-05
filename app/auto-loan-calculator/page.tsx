import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AutoLoanCalculatorClient from "./AutoLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Auto Loan Calculator | Toollane",

  description:
    "Calculate car loan payments, total repayment and interest instantly with Toollane's free online auto loan calculator.",
};

export default function AutoLoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Auto Loan Calculator"
      description="Calculate car loan payments and total interest instantly online."


      href="/auto-loan-calculator"
    >
      <AutoLoanCalculatorClient />
    </ToolPageLayout>
  );
}