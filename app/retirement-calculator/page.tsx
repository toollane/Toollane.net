import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RetirementCalculatorClient from "./RetirementCalculatorClient";

export const metadata: Metadata = {
  title: "Retirement Calculator | Savings & Retirement Goal | Toollane",
  description:
    "Estimate retirement savings, required nest egg, monthly contributions, retirement income and savings gap online with Toollane's free retirement calculator.",


  alternates: {
    canonical: "/retirement-calculator",
  },
};

export default function RetirementCalculatorPage() {
  return (
    <ToolPageLayout
      title="Retirement Calculator"
      description="Estimate your retirement savings, required nest egg, monthly contribution goal and retirement funding gap with a detailed planning calculator."
      href="/retirement-calculator"
    >
      <RetirementCalculatorClient />
    </ToolPageLayout>
  );
}