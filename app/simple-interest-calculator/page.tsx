import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SimpleInterestCalculatorClient from "./SimpleInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Simple Interest Calculator | Principal, Rate & Time | Toollane",
  description:
    "Calculate simple interest, final amount, after-tax interest, inflation-adjusted value and return with Toollane's free online simple interest calculator.",
};

export default function SimpleInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest, final amount, after-tax interest, inflation-adjusted value and total return instantly online."
      href="/simple-interest-calculator"
    >
      <SimpleInterestCalculatorClient />
    </ToolPageLayout>
  );
}