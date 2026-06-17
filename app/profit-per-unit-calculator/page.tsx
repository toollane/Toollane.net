import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ProfitPerUnitCalculatorClient from "./ProfitPerUnitCalculatorClient";

export const metadata: Metadata = {
  title: "Profit Per Unit Calculator | Toollane",

  description:
    "Calculate profit per unit, total profit and margin with Toollane's free online profit per unit calculator.",


  alternates: {
    canonical: "/profit-per-unit-calculator",
  },
};

export default function ProfitPerUnitCalculatorPage() {
  return (
    <ToolPageLayout
      title="Profit Per Unit Calculator"
      description="Calculate profit per unit, total profit and margin instantly online."


      href="/profit-per-unit-calculator"
    >
      <ProfitPerUnitCalculatorClient />
    </ToolPageLayout>
  );
}