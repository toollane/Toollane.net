import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UnitPriceCalculatorClient from "./UnitPriceCalculatorClient";

export const metadata: Metadata = {
  title: "Unit Price Calculator | Toollane",

  description:
    "Calculate price per unit and compare value instantly with Toollane's free online unit price calculator.",


  alternates: {
    canonical: "/unit-price-calculator",
  },
};

export default function UnitPriceCalculatorPage() {
  return (
    <ToolPageLayout
      title="Unit Price Calculator"
      description="Calculate price per unit and compare value instantly online."


      href="/unit-price-calculator"
    >
      <UnitPriceCalculatorClient />
    </ToolPageLayout>
  );
}