import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TimeDurationCalculatorClient from "./TimeDurationCalculatorClient";

export const metadata: Metadata = {
  title: "Time Duration Calculator | Toollane",

  description:
    "Calculate time duration between two times instantly with Toollane's free online time duration calculator.",


  alternates: {
    canonical: "/time-duration-calculator",
  },
};

export default function TimeDurationCalculatorPage() {
  return (
    <ToolPageLayout
      title="Time Duration Calculator"
      description="Calculate time duration between two times instantly online."


      href="/time-duration-calculator"
    >
      <TimeDurationCalculatorClient />
    </ToolPageLayout>
  );
}