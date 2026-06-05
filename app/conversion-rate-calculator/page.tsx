import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ConversionRateCalculatorClient from "./ConversionRateCalculatorClient";

export const metadata: Metadata = {
  title: "Conversion Rate Calculator | Toollane",

  description:
    "Calculate conversion rate instantly with Toollane's free online conversion rate calculator.",
};

export default function ConversionRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Conversion Rate Calculator"
      description="Calculate conversion rate instantly online."


      href="/conversion-rate-calculator"
    >
      <ConversionRateCalculatorClient />
    </ToolPageLayout>
  );
}