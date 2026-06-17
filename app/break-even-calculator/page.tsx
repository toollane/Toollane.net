import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BreakEvenCalculatorClient from "./BreakEvenCalculatorClient";

export const metadata: Metadata = {
  title: "Break-Even Calculator | Units, Revenue & Margin | Toollane",
  description:
    "Calculate break-even units, break-even revenue, contribution margin, target profit and safety margin online with Toollane's free break-even calculator.",


  alternates: {
    canonical: "/break-even-calculator",
  },
};

export default function BreakEvenCalculatorPage() {
  return (
    <ToolPageLayout
      title="Break-Even Calculator"
      description="Calculate break-even units, break-even revenue, contribution margin, target profit and expected profit for a product, service or business."
      href="/break-even-calculator"
    >
      <BreakEvenCalculatorClient />
    </ToolPageLayout>
  );
}