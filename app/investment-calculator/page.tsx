import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InvestmentCalculatorClient from "./InvestmentCalculatorClient";

export const metadata: Metadata = {
  title:
    "Investment Calculator | Toollane",

  description:
    "Calculate investment growth, future value and recurring contributions instantly with Toollane's free online investment calculator.",
};

export default function InvestmentCalculatorPage() {
  return (
    <ToolPageLayout
      title="Investment Calculator"
      description="Calculate investment growth and future portfolio value instantly online."


      href="/investment-calculator"
    >
      <InvestmentCalculatorClient />
    </ToolPageLayout>
  );
}