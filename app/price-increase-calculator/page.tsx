import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PriceIncreaseCalculatorClient from "./PriceIncreaseCalculatorClient";

export const metadata: Metadata = {
  title: "Price Increase Calculator | Toollane",

  description:
    "Calculate price increase amount and new price instantly with Toollane's free online price increase calculator.",


  alternates: {
    canonical: "/price-increase-calculator",
  },
};

export default function PriceIncreaseCalculatorPage() {
  return (
    <ToolPageLayout
      title="Price Increase Calculator"
      description="Calculate price increase amount and new price instantly online."


      href="/price-increase-calculator"
    >
      <PriceIncreaseCalculatorClient />
    </ToolPageLayout>
  );
}