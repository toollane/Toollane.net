import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FreelanceRateCalculatorClient from "./FreelanceRateCalculatorClient";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator | Toollane",

  description:
    "Calculate your freelance hourly rate, monthly revenue target and annual revenue goal with Toollane's free online calculator.",


  alternates: {
    canonical: "/freelance-rate-calculator",
  },
};

export default function FreelanceRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Freelance Rate Calculator"
      description="Calculate your hourly freelance rate and revenue target instantly online."


      href="/freelance-rate-calculator"
    >
      <FreelanceRateCalculatorClient />
    </ToolPageLayout>
  );
}