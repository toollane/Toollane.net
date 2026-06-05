import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AprCalculatorClient from "./AprCalculatorClient";

export const metadata: Metadata = {
  title: "APR Calculator | Toollane",

  description:
    "Estimate APR, loan fees and borrowing cost with Toollane's free online APR calculator.",
};

export default function AprCalculatorPage() {
  return (
    <ToolPageLayout
      title="APR Calculator"
      description="Estimate APR, fees and borrowing cost instantly online."


      href="/apr-calculator"
    >
      <AprCalculatorClient />
    </ToolPageLayout>
  );
}