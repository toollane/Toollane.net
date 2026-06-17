import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SponsorshipRateCalculatorClient from "./SponsorshipRateCalculatorClient";

export const metadata: Metadata = {
  title: "Sponsorship Rate Calculator | Toollane",

  description:
    "Estimate sponsorship rates from views, CPM and placements with Toollane's free online sponsorship rate calculator.",


  alternates: {
    canonical: "/sponsorship-rate-calculator",
  },
};

export default function SponsorshipRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Sponsorship Rate Calculator"
      description="Estimate creator sponsorship pricing instantly online."


      href="/sponsorship-rate-calculator"
    >
      <SponsorshipRateCalculatorClient />
    </ToolPageLayout>
  );
}