import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RentVsBuyCalculatorClient from "./RentVsBuyCalculatorClient";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator | Toollane",
  description:
    "Compare the cost of renting vs buying a home. Estimate mortgage payments, rent growth, home equity, selling costs and investment returns.",
  alternates: {
    canonical: "https://toollane.net/rent-vs-buy-calculator",
  },
};

export default function RentVsBuyCalculatorPage() {
  return (
    <ToolPageLayout
      title="Rent vs Buy Calculator"
      description="Compare the long-term cost of renting vs buying a home."
      href="/rent-vs-buy-calculator"
    >
      <RentVsBuyCalculatorClient />
    </ToolPageLayout>
  );
}