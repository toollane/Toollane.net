import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SavingsCalculatorClient from "./SavingsCalculatorClient";

export const metadata: Metadata = {
  title: "Savings Calculator | Toollane",

  description:
    "Calculate how much you can save over time with Toollane's free online savings calculator.",
};

export default function SavingsCalculatorPage() {
  return (
    <ToolPageLayout
      title="Savings Calculator"
      description="Calculate how much you can save over time instantly online."


      href="/savings-calculator"
    >
      <SavingsCalculatorClient />
    </ToolPageLayout>
  );
}