import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MortgagePayoffCalculatorClient from "./MortgagePayoffCalculatorClient";

export const metadata: Metadata = {
  title: "Mortgage Payoff Calculator | Toollane",
  description:
    "Calculate how extra mortgage payments can shorten your loan, reduce interest and help you pay off your mortgage faster.",
  alternates: {
    canonical: "https://toollane.net/mortgage-payoff-calculator",
  },
};

export default function MortgagePayoffCalculatorPage() {
  return (
    <ToolPageLayout
      title="Mortgage Payoff Calculator"
      description="Estimate how extra payments can reduce interest and help you pay off your mortgage faster."
      href="/mortgage-payoff-calculator"
    >
      <MortgagePayoffCalculatorClient />
    </ToolPageLayout>
  );
}