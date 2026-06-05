import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DateDifferenceCalculatorClient from "./DateDifferenceCalculatorClient";

export const metadata: Metadata = {
  title: "Date Difference Calculator | Toollane",

  description:
    "Calculate the difference between two dates instantly with Toollane's free online date difference calculator.",
};

export default function DateDifferenceCalculatorPage() {
  return (
    <ToolPageLayout
      title="Date Difference Calculator"
      description="Calculate the difference between two dates instantly online."


      href="/date-difference-calculator"
    >
      <DateDifferenceCalculatorClient />
    </ToolPageLayout>
  );
}