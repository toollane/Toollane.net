import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InvestmentCalculatorClient from "./InvestmentCalculatorClient";

export const metadata: Metadata = {
  title: "Investment Calculator | Growth & Future Value | Toollane",
  description:
    "Calculate investment growth, future value, recurring contributions, fees, taxes and inflation-adjusted returns online with Toollane's free investment calculator.",
};

export default function InvestmentCalculatorPage() {
  return (
    <ToolPageLayout
      title="Investment Calculator"
      description="Calculate investment growth, future portfolio value, recurring contributions, fees, taxes and inflation-adjusted returns."
      href="/investment-calculator"
    >
      <InvestmentCalculatorClient />
    </ToolPageLayout>
  );
}