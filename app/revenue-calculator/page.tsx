import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RevenueCalculatorClient from "./RevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Revenue Calculator | Toollane",

  description:
    "Calculate revenue from units sold and price per unit with Toollane's free online revenue calculator.",


  alternates: {
    canonical: "/revenue-calculator",
  },
};

export default function RevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Revenue Calculator"
      description="Calculate revenue from units sold and price per unit instantly online."


      href="/revenue-calculator"
    >
      <RevenueCalculatorClient />
    </ToolPageLayout>
  );
}