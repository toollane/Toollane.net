import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RentalPropertyCalculatorClient from "./RentalPropertyCalculatorClient";

export const metadata: Metadata = {
  title: "Rental Property Calculator | Toollane",
  description:
    "Estimate rental property cash flow, cap rate, cash-on-cash return, net operating income and break-even rent.",
  alternates: {
    canonical: "https://toollane.net/rental-property-calculator",
  },
};

export default function RentalPropertyCalculatorPage() {
  return (
    <ToolPageLayout
      title="Rental Property Calculator"
      description="Estimate rental income, expenses, cash flow, cap rate and cash-on-cash return for an investment property."
      href="/rental-property-calculator"
    >
      <RentalPropertyCalculatorClient />
    </ToolPageLayout>
  );
}