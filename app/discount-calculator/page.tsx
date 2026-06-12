import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import DiscountCalculatorClient from "./DiscountCalculatorClient";

export const metadata: Metadata = {
  title: "Discount Calculator | Sale Price & Savings | Toollane",
  description:
    "Calculate discounts, sale prices, savings, stacked discounts, tax, shipping and final price online with Toollane's free discount calculator.",
};

export default function DiscountCalculatorPage() {
  return (
    <ToolPageLayout
      title="Discount Calculator"
      description="Calculate sale price, total savings, stacked discounts, tax, shipping and final checkout price instantly online."
      href="/discount-calculator"
    >
      <DiscountCalculatorClient />
    </ToolPageLayout>
  );
}