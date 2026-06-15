import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarginMarkupCalculatorClient from "./MarginMarkupCalculatorClient";

export const metadata: Metadata = {
  title: "Margin & Markup Calculator | Profit, Price & Margin | Toollane",
  description:
    "Calculate profit margin, markup, selling price, profit per unit, break-even units, discounts and taxes online with Toollane's free margin and markup calculator.",
};

export default function MarginMarkupCalculatorPage() {
  return (
    <ToolPageLayout
      title="Margin & Markup Calculator"
      description="Calculate profit margin, markup, selling price, profit per unit, break-even units, discounts and total profit instantly online."
      href="/margin-markup-calculator"
    >
      <MarginMarkupCalculatorClient />
    </ToolPageLayout>
  );
}