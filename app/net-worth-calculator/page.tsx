import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import NetWorthCalculatorClient from "./NetWorthCalculatorClient";

export const metadata: Metadata = {
  title: "Net Worth Calculator | Toollane",

  description:
    "Calculate total assets, total debts and net worth instantly with Toollane's free online net worth calculator.",
};

export default function NetWorthCalculatorPage() {
  return (
    <ToolPageLayout
      title="Net Worth Calculator"
      description="Calculate your total assets, debts and net worth instantly online."


      href="/net-worth-calculator"
    >
      <NetWorthCalculatorClient />
    </ToolPageLayout>
  );
}