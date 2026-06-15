import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CacCalculatorClient from "./CacCalculatorClient";

export const metadata: Metadata = {
  title: "CAC Calculator | Customer Acquisition Cost Calculator | Toollane",
  description:
    "Calculate customer acquisition cost online. Estimate CAC from marketing, sales, team and tool costs, then compare CAC with LTV and payback period.",
};

export default function CacCalculatorPage() {
  return (
    <ToolPageLayout
      title="CAC Calculator"
      description="Calculate customer acquisition cost from marketing, sales, team and tool costs. Compare CAC with payback period, LTV and target acquisition costs."
      href="/cac-calculator"
    >
      <CacCalculatorClient />
    </ToolPageLayout>
  );
}