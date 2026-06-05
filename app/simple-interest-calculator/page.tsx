import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SimpleInterestCalculatorClient from "./SimpleInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Simple Interest Calculator | Toollane",

  description:
    "Calculate simple interest and total amount instantly with Toollane's free online simple interest calculator.",
};

export default function SimpleInterestCalculatorPage() {
  return (
    <ToolPageLayout
      title="Simple Interest Calculator"
      description="Calculate simple interest and total amount instantly online."


      href="/simple-interest-calculator"
    >
      <SimpleInterestCalculatorClient />
    </ToolPageLayout>
  );
}