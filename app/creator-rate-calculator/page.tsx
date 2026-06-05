import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CreatorRateCalculatorClient from "./CreatorRateCalculatorClient";

export const metadata: Metadata = {
  title: "Creator Rate Calculator | Toollane",

  description:
    "Calculate creator project rates, usage fees and total pricing with Toollane's free online creator rate calculator.",
};

export default function CreatorRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Creator Rate Calculator"
      description="Calculate creator project rates and pricing instantly online."


      href="/creator-rate-calculator"
    >
      <CreatorRateCalculatorClient />
    </ToolPageLayout>
  );
}