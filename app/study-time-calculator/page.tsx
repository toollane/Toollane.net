import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import StudyTimeCalculatorClient from "./StudyTimeCalculatorClient";

export const metadata: Metadata = {
  title: "Study Time Calculator | Toollane",

  description:
    "Plan study time and calculate daily study minutes instantly with Toollane's free online study time calculator.",
};

export default function StudyTimeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Study Time Calculator"
      description="Plan study time and daily study minutes instantly online."


      href="/study-time-calculator"
    >
      <StudyTimeCalculatorClient />
    </ToolPageLayout>
  );
}