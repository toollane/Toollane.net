import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PropertyTaxCalculatorClient from "./PropertyTaxCalculatorClient";

export const metadata: Metadata = {
  title: "Property Tax Calculator | Toollane",
  description:
    "Estimate annual and monthly property tax based on property value, tax rate, assessed value percentage and future tax increases.",
  alternates: {
    canonical: "https://toollane.net/property-tax-calculator",
  },
};

export default function PropertyTaxCalculatorPage() {
  return (
    <ToolPageLayout
      title="Property Tax Calculator"
      description="Estimate annual property tax, monthly tax cost and projected tax payments over time."
      href="/property-tax-calculator"
    >
      <PropertyTaxCalculatorClient />
    </ToolPageLayout>
  );
}