import type { Metadata } from "next";

import PercentageCalculatorClient from "./PercentageCalculatorClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Percentage Calculator | Toollane",
  description:
    "Calculate percentages, percentage increases and percentage decreases instantly with Toollane's free online percentage calculator.",
};

export default function PercentageCalculatorPage() {
  return (
    <ToolPageLayout
      title="Percentage Calculator"
      description="Calculate percentages, percentage increases and percentage decreases instantly online."


      href="/percentage-calculator"
    >
      <PercentageCalculatorClient />
    </ToolPageLayout>
  );
}