import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PaybackPeriodCalculatorClient from "./PaybackPeriodCalculatorClient";

export const metadata: Metadata = {
  title: "Payback Period Calculator | Investment Recovery | Toollane",
  description:
    "Calculate payback period, discounted payback, monthly cash flow, investment recovery time and ROI with Toollane's free online payback period calculator.",
};

export default function PaybackPeriodCalculatorPage() {
  return (
    <ToolPageLayout
      title="Payback Period Calculator"
      description="Calculate how long it takes to recover an investment using monthly cash flow, growth and discounted payback assumptions."
      href="/payback-period-calculator"
    >
      <PaybackPeriodCalculatorClient />
    </ToolPageLayout>
  );
}