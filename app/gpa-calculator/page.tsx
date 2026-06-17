import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import GpaCalculatorClient from "./GpaCalculatorClient";

export const metadata: Metadata = {
  title: "GPA Calculator | Toollane",

  description:
    "Calculate GPA instantly with Toollane's free online GPA calculator.",


  alternates: {
    canonical: "/gpa-calculator",
  },
};

export default function GpaCalculatorPage() {
  return (
    <ToolPageLayout
      title="GPA Calculator"
      description="Calculate GPA instantly online."


      href="/gpa-calculator"
    >
      <GpaCalculatorClient />
    </ToolPageLayout>
  );
}