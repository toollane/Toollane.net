import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgageRefinanceCalculatorClient from "./MortgageRefinanceCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Refinance Calculator | Toollane",
  description:
    "Calculate whether refinancing your mortgage could save money. Compare current and new payments, closing costs, break-even time and lifetime savings.",
  alternates: {
    canonical: "https://toollane.net/mortgage-refinance-calculator",
  },
};

export default function MortgageRefinanceCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Refinance Calculator"
      description="Compare your current mortgage with a refinance option and estimate savings, break-even time and total cost."
      href="/mortgage-refinance-calculator"
    >
      <MortgageRefinanceCalculatorClient />
    </ToolPageLayout>
  );
}