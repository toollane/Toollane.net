import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CompoundInterestCalculatorClient from "./CompoundInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Toollane",

  description:
    "Calculate compound interest, future value, contributions and interest earned with Toollane's free online calculator.",
};

export default function CompoundInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Compound Interest Calculator"
      description="Calculate compound interest, future value and investment growth instantly online."


      href="/compound-interest-calculator"
    >
      <CompoundInterestCalculatorClient />
    </ToolPageLayout>
  );
}