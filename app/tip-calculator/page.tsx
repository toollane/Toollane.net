import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TipCalculatorClient from "./TipCalculatorClient";

export const metadata: Metadata = {
  title: "Tip Calculator | Toollane",

  description:
    "Calculate tips, totals and split bills instantly with Toollane's free online tip calculator.",


  alternates: {
    canonical: "/tip-calculator",
  },
};

export default function TipCalculatorPage() {
  return (
    <ToolPageLayout
      title="Tip Calculator"
      description="Calculate tips, totals and split bills instantly online."


      href="/tip-calculator"
    >
      <TipCalculatorClient />
    </ToolPageLayout>
  );
}