import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CpmCalculatorClient from "./CpmCalculatorClient";

export const metadata: Metadata = {
  title: "CPM Calculator | Toollane",

  description:
    "Calculate cost per thousand impressions instantly with Toollane's free online CPM calculator.",


  alternates: {
    canonical: "/cpm-calculator",
  },
};

export default function CpmCalculatorPage() {
  return (
    <ToolPageLayout
      title="CPM Calculator"
      description="Calculate cost per thousand impressions instantly online."


      href="/cpm-calculator"
    >
      <CpmCalculatorClient />
    </ToolPageLayout>
  );
}