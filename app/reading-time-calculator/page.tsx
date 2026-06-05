import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReadingTimeCalculatorClient from "./ReadingTimeCalculatorClient";

export const metadata: Metadata = {
  title: "Reading Time Calculator | Toollane",

  description:
    "Estimate article and text reading time instantly with Toollane's free online reading time calculator.",
};

export default function ReadingTimeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Reading Time Calculator"
      description="Estimate reading time instantly online."


      href="/reading-time-calculator"
    >
      <ReadingTimeCalculatorClient />
    </ToolPageLayout>
  );
}