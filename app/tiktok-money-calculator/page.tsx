import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TiktokMoneyCalculatorClient from "./TiktokMoneyCalculatorClient";

export const metadata: Metadata = {
  title: "TikTok Money Calculator | Toollane",

  description:
    "Estimate TikTok earnings instantly with Toollane's free online TikTok money calculator.",


  alternates: {
    canonical: "/tiktok-money-calculator",
  },
};

export default function TiktokMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="TikTok Money Calculator"
      description="Estimate TikTok earnings instantly online."


      href="/tiktok-money-calculator"
    >
      <TiktokMoneyCalculatorClient />
    </ToolPageLayout>
  );
}