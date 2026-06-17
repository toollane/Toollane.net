import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PodcastRevenueCalculatorClient from "./PodcastRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Podcast Revenue Calculator | Toollane",

  description:
    "Estimate podcast ad revenue from downloads, CPM and ad slots with Toollane's free online podcast revenue calculator.",


  alternates: {
    canonical: "/podcast-revenue-calculator",
  },
};

export default function PodcastRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Podcast Revenue Calculator"
      description="Estimate podcast ad revenue instantly online."


      href="/podcast-revenue-calculator"
    >
      <PodcastRevenueCalculatorClient />
    </ToolPageLayout>
  );
}