import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WorkingDaysCalculatorClient from "./WorkingDaysCalculatorClient";

export const metadata: Metadata = {
  title: "Working Days Calculator | Toollane",

  description:
    "Calculate weekdays and working days between two dates with Toollane's free online calculator.",
};

export default function WorkingDaysCalculatorPage() {
  return (
    <ToolPageLayout
      title="Working Days Calculator"
      description="Calculate weekdays and working days between two dates instantly online."


      href="/working-days-calculator"
    >
      <WorkingDaysCalculatorClient />
    </ToolPageLayout>
  );
}