import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RetirementCalculatorClient from "./RetirementCalculatorClient";

export const metadata: Metadata = {
  title: "Retirement Calculator | Toollane",

  description:
    "Estimate retirement savings, future balance, contributions and investment growth with Toollane's free online retirement calculator.",
};

export default function RetirementCalculatorPage() {
  return (
    <ToolPageLayout
      title="Retirement Calculator"
      description="Estimate retirement savings and future investment growth instantly online."


      href="/retirement-calculator"
    >
      <RetirementCalculatorClient />
    </ToolPageLayout>
  );
}