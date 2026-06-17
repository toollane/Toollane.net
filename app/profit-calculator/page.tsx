import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ProfitCalculatorClient from "./ProfitCalculatorClient";

export const metadata: Metadata = {
  title: "Profit Calculator | Net Profit & Margin | Toollane",
  description:
    "Calculate gross profit, net profit, profit margin, expenses, transaction fees and estimated taxes online with Toollane's free profit calculator.",


  alternates: {
    canonical: "/profit-calculator",
  },
};

export default function ProfitCalculatorPage() {
  return (
    <ToolPageLayout
      title="Profit Calculator"
      description="Calculate gross profit, net profit, profit margin, expenses, transaction fees and estimated taxes for a business, product or service."
      href="/profit-calculator"
    >
      <ProfitCalculatorClient />
    </ToolPageLayout>
  );
}