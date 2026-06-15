import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InflationCalculatorClient from "./InflationCalculatorClient";

export const metadata: Metadata = {
  title: "Inflation Calculator | Future Cost & Purchasing Power | Toollane",
  description:
    "Calculate future cost, cumulative inflation, purchasing power loss and income growth impact with Toollane's free online inflation calculator.",
};

export default function InflationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Inflation Calculator"
      description="Estimate future cost, purchasing power loss, cumulative inflation and income growth impact instantly online."
      href="/inflation-calculator"
    >
      <InflationCalculatorClient />
    </ToolPageLayout>
  );
}