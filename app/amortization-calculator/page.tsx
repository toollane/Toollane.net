import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AmortizationCalculatorClient from "./AmortizationCalculatorClient";

export const metadata: Metadata = {
  title: "Amortization Calculator | Toollane",
  description:
    "Calculate monthly loan payments, total interest, payoff date and an amortization schedule with optional extra payments.",
  alternates: {
    canonical: "https://toollane.net/amortization-calculator",
  },
};

export default function AmortizationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Amortization Calculator"
      description="Calculate loan payments, interest, payoff date and an amortization schedule over time."
      href="/amortization-calculator"
    >
      <AmortizationCalculatorClient />
    </ToolPageLayout>
  );
}