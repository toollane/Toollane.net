import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgageComparisonCalculatorClient from "./MortgageComparisonCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Comparison Calculator | Toollane",
  description:
    "Compare mortgage options by monthly payment, interest, upfront costs, remaining balance and estimated cost over your ownership period.",
  alternates: {
    canonical: "https://toollane.net/mortgage-comparison-calculator",
  },
};

export default function MortgageComparisonCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Comparison Calculator"
      description="Compare mortgage offers by payment, interest, fees and estimated cost over time."
      href="/mortgage-comparison-calculator"
    >
      <MortgageComparisonCalculatorClient />
    </ToolPageLayout>
  );
}