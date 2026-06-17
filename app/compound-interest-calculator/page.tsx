import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CompoundInterestCalculatorClient from "./CompoundInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Future Value & Growth | Toollane",
  description:
    "Calculate compound interest, future value, recurring contributions, interest earned, taxes and inflation-adjusted growth online with Toollane.",


  alternates: {
    canonical: "/compound-interest-calculator",
  },
};

export default function CompoundInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Compound Interest Calculator"
      description="Calculate compound interest, future value, recurring contributions, compounding frequency, interest earned and inflation-adjusted growth."
      href="/compound-interest-calculator"
    >
      <CompoundInterestCalculatorClient />
    </ToolPageLayout>
  );
}