import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HomeAffordabilityCalculatorClient from "./HomeAffordabilityCalculatorClient";

export const metadata: Metadata = {
  title: "Home Affordability Calculator | Toollane",
  description:
    "Estimate how much house you can afford based on income, debts, down payment, mortgage rate, property taxes, insurance and debt-to-income ratios.",
  alternates: {
    canonical: "https://toollane.net/home-affordability-calculator",
  },
};

export default function HomeAffordabilityCalculatorPage() {
  return (
    <ToolPageLayout
      title="Home Affordability Calculator"
      description="Estimate how much house you can afford based on income, debts, down payment and mortgage assumptions."
      href="/home-affordability-calculator"
    >
      <HomeAffordabilityCalculatorClient />
    </ToolPageLayout>
  );
}