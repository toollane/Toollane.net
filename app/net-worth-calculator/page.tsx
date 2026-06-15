import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import NetWorthCalculatorClient from "./NetWorthCalculatorClient";

export const metadata: Metadata = {
  title: "Net Worth Calculator | Assets, Debts & Equity | Toollane",
  description:
    "Calculate total assets, total liabilities, net worth, debt-to-asset ratio and equity ratio with Toollane's free online net worth calculator.",
};

export default function NetWorthCalculatorPage() {
  return (
    <ToolPageLayout
      title="Net Worth Calculator"
      description="Calculate your total assets, liabilities, net worth, debt-to-asset ratio and financial position instantly online."
      href="/net-worth-calculator"
    >
      <NetWorthCalculatorClient />
    </ToolPageLayout>
  );
}