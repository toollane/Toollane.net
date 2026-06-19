import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ClosingCostCalculatorClient from "./ClosingCostCalculatorClient";

export const metadata: Metadata = {
  title: "Closing Cost Calculator | Toollane",
  description:
    "Estimate buyer closing costs, prepaid taxes, insurance reserves, lender fees, title fees and total cash needed to close on a home.",
  alternates: {
    canonical: "https://toollane.net/closing-cost-calculator",
  },
};

export default function ClosingCostCalculatorPage() {
  return (
    <ToolPageLayout
      title="Closing Cost Calculator"
      description="Estimate closing costs and total cash needed to close on a home purchase."
      href="/closing-cost-calculator"
    >
      <ClosingCostCalculatorClient />
    </ToolPageLayout>
  );
}