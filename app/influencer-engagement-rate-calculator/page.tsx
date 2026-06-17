import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InfluencerEngagementRateCalculatorClient from "./InfluencerEngagementRateCalculatorClient";

export const metadata: Metadata = {
  title: "Influencer Engagement Rate Calculator | Toollane",

  description:
    "Calculate influencer engagement rate instantly with Toollane's free online engagement rate calculator.",


  alternates: {
    canonical: "/influencer-engagement-rate-calculator",
  },
};

export default function InfluencerEngagementRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Influencer Engagement Rate Calculator"
      description="Calculate influencer engagement rate instantly online."


      href="/influencer-engagement-rate-calculator"
    >
      <InfluencerEngagementRateCalculatorClient />
    </ToolPageLayout>
  );
}