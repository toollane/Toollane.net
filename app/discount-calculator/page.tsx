import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DiscountCalculatorClient from "./DiscountCalculatorClient";

export const metadata: Metadata = {
  title: "Discount Calculator | Toollane",

  description:
    "Calculate discounts, savings and final prices instantly with Toollane's free online discount calculator.",
};

export default function DiscountCalculatorPage() {
  return (
    <ToolPageLayout
      title="Discount Calculator"
      description="Calculate discounts, savings and final prices instantly online."


      href="/discount-calculator"
    >
      <DiscountCalculatorClient />
    </ToolPageLayout>
  );
}