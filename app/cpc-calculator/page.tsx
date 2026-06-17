import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CpcCalculatorClient from "./CpcCalculatorClient";

export const metadata: Metadata = {
  title: "CPC Calculator | Toollane",

  description:
    "Calculate cost per click instantly with Toollane's free online CPC calculator.",


  alternates: {
    canonical: "/cpc-calculator",
  },
};

export default function CpcCalculatorPage() {
  return (
    <ToolPageLayout
      title="CPC Calculator"
      description="Calculate cost per click instantly online."


      href="/cpc-calculator"
    >
      <CpcCalculatorClient />
    </ToolPageLayout>
  );
}