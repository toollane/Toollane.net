import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ChurnRateCalculatorClient from "./ChurnRateCalculatorClient";

export const metadata: Metadata = {
  title: "Churn Rate Calculator | SaaS Churn Calculator | Toollane",
  description:
    "Calculate customer churn, revenue churn, retention, NRR, GRR and MRR growth online with Toollane's free churn rate calculator.",


  alternates: {
    canonical: "/churn-rate-calculator",
  },
};

export default function ChurnRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Churn Rate Calculator"
      description="Calculate customer churn, revenue churn, retention, NRR, GRR and MRR growth from your customer and revenue movement."
      href="/churn-rate-calculator"
    >
      <ChurnRateCalculatorClient />
    </ToolPageLayout>
  );
}