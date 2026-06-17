import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SalesTaxCalculatorClient from "./SalesTaxCalculatorClient";

export const metadata: Metadata = {
  title: "Sales Tax Calculator | Toollane",

  description:
    "Calculate sales tax and final price instantly with Toollane's free online sales tax calculator.",


  alternates: {
    canonical: "/sales-tax-calculator",
  },
};

export default function SalesTaxCalculatorPage() {
  return (
    <ToolPageLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax and final price instantly online."


      href="/sales-tax-calculator"
    >
      <SalesTaxCalculatorClient />
    </ToolPageLayout>
  );
}