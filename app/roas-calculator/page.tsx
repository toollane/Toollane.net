import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RoasCalculatorClient from "./RoasCalculatorClient";

export const metadata: Metadata = {
  title: "ROAS Calculator | Toollane",

  description:
    "Calculate return on ad spend instantly with Toollane's free online ROAS calculator.",
};

export default function RoasCalculatorPage() {
  return (
    <ToolPageLayout
      title="ROAS Calculator"
      description="Calculate return on ad spend instantly online."


      href="/roas-calculator"
    >
      <RoasCalculatorClient />
    </ToolPageLayout>
  );
}