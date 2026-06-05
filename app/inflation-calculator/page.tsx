import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InflationCalculatorClient from "./InflationCalculatorClient";

export const metadata: Metadata = {
  title: "Inflation Calculator | Toollane",

  description:
    "Calculate future cost and price increase from inflation with Toollane's free online inflation calculator.",
};

export default function InflationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Inflation Calculator"
      description="Estimate future cost and inflation impact instantly online."


      href="/inflation-calculator"
    >
      <InflationCalculatorClient />
    </ToolPageLayout>
  );
}