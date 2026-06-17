import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import GradeCalculatorClient from "./GradeCalculatorClient";

export const metadata: Metadata = {
  title: "Grade Calculator | Toollane",

  description:
    "Calculate grade percentage and letter grade instantly with Toollane's free online grade calculator.",


  alternates: {
    canonical: "/grade-calculator",
  },
};

export default function GradeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Grade Calculator"
      description="Calculate grade percentage and estimated letter grade instantly online."


      href="/grade-calculator"
    >
      <GradeCalculatorClient />
    </ToolPageLayout>
  );
}