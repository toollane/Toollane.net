import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RunwayCalculatorClient from "./RunwayCalculatorClient";

export const metadata: Metadata = {
  title: "Runway Calculator | Startup Runway & Burn Rate Calculator | Toollane",
  description:
    "Calculate startup runway online. Estimate cash runway, burn rate, break-even gap, cash-out date and 24-month cash projection.",
};

export default function RunwayCalculatorPage() {
  return (
    <ToolPageLayout
      title="Runway Calculator"
      description="Calculate startup runway, burn rate, break-even gap, cash-out date and cash projection from your cash balance, revenue and expenses."
      href="/runway-calculator"
    >
      <RunwayCalculatorClient />
    </ToolPageLayout>
  );
}