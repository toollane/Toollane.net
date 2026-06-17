import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CommissionCalculatorClient from "./CommissionCalculatorClient";

export const metadata: Metadata = {
  title: "Commission Calculator | Toollane",

  description:
    "Calculate sales commission instantly with Toollane's free online commission calculator.",


  alternates: {
    canonical: "/commission-calculator",
  },
};

export default function CommissionCalculatorPage() {
  return (
    <ToolPageLayout
      title="Commission Calculator"
      description="Calculate sales commission instantly online."


      href="/commission-calculator"
    >
      <CommissionCalculatorClient />
    </ToolPageLayout>
  );
}