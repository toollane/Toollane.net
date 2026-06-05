import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AdRevenueCalculatorClient from "./AdRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Ad Revenue Calculator | Toollane",

  description:
    "Estimate ad revenue from pageviews and RPM with Toollane's free online ad revenue calculator.",
};

export default function AdRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Ad Revenue Calculator"
      description="Estimate website, blog or creator ad revenue instantly online."


      href="/ad-revenue-calculator"
    >
      <AdRevenueCalculatorClient />
    </ToolPageLayout>
  );
}