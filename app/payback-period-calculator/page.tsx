import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PaybackPeriodCalculatorClient from "./PaybackPeriodCalculatorClient";

export const metadata: Metadata = {
  title: "Payback Period Calculator | Toollane",

  description:
    "Calculate payback period in years and months with Toollane's free online payback period calculator.",
};

export default function PaybackPeriodCalculatorPage() {
  return (
    <ToolPageLayout
      title="Payback Period Calculator"
      description="Calculate how long it takes to recover an investment instantly online."


      href="/payback-period-calculator"
    >
      <PaybackPeriodCalculatorClient />
    </ToolPageLayout>
  );
}