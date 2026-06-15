import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AprCalculatorClient from "./AprCalculatorClient";

export const metadata: Metadata = {
  title: "APR Calculator | Loan Fees & Borrowing Cost | Toollane",
  description:
    "Estimate APR, loan fees, monthly payment, amount received, finance charge and total borrowing cost with Toollane's free online APR calculator.",
};

export default function AprCalculatorPage() {
  return (
    <ToolPageLayout
      title="APR Calculator"
      description="Estimate APR, loan fees, monthly payment, amount received and total borrowing cost instantly online."
      href="/apr-calculator"
    >
      <AprCalculatorClient />
    </ToolPageLayout>
  );
}