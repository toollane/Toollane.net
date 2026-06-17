import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AutoLoanCalculatorClient from "./AutoLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Auto Loan Calculator | Car Payment & Interest | Toollane",
  description:
    "Calculate car loan payments, auto loan interest, sales tax, fees, trade-in value, down payment and total vehicle financing cost with Toollane's free auto loan calculator.",


  alternates: {
    canonical: "/auto-loan-calculator",
  },
};

export default function AutoLoanCalculatorPage() {
  return (
    <ToolPageLayout
      title="Auto Loan Calculator"
      description="Calculate car loan payments, interest, sales tax, fees, trade-in value, down payment and total financing cost instantly online."
      href="/auto-loan-calculator"
    >
      <AutoLoanCalculatorClient />
    </ToolPageLayout>
  );
}