import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AgeCalculatorClient from "./AgeCalculatorClient";

export const metadata: Metadata = {
  title:
    "Age Calculator | Toollane",

  description:
    "Calculate your exact age in years, months and days instantly with Toollane's free online age calculator.",
};

export default function AgeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Age Calculator"
      description="Calculate your exact age instantly online."


      href="/age-calculator"
    >
      <AgeCalculatorClient />
    </ToolPageLayout>
  );
}