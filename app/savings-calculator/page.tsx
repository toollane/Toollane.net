import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SavingsCalculatorClient from "./SavingsCalculatorClient";

export const metadata: Metadata = {
  title: "Savings Calculator | Interest & Future Balance | Toollane",
  description:
    "Calculate savings growth, future balance, recurring contributions, interest, taxes and inflation-adjusted value online with Toollane's free savings calculator.",
};

export default function SavingsCalculatorPage() {
  return (
    <ToolPageLayout
      title="Savings Calculator"
      description="Calculate savings growth, future balance, recurring contributions, interest earned, taxes and inflation-adjusted value."
      href="/savings-calculator"
    >
      <SavingsCalculatorClient />
    </ToolPageLayout>
  );
}