import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LtvCalculatorClient from "./LtvCalculatorClient";

export const metadata: Metadata = {
  title: "LTV Calculator | Customer Lifetime Value Calculator | Toollane",
  description:
    "Calculate customer lifetime value online. Estimate LTV from ARPA, gross margin and monthly churn, then compare it with CAC and payback period.",
};

export default function LtvCalculatorPage() {
  return (
    <ToolPageLayout
      title="LTV Calculator"
      description="Calculate customer lifetime value from ARPA, gross margin and monthly churn. Compare LTV with CAC, payback period and target acquisition costs."
      href="/ltv-calculator"
    >
      <LtvCalculatorClient />
    </ToolPageLayout>
  );
}