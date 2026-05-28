import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TiktokMoneyCalculatorClient from "./TiktokMoneyCalculatorClient";

export const metadata: Metadata = {
  title: "TikTok Money Calculator | Toollane",

  description:
    "Estimate TikTok earnings instantly with Toollane's free online TikTok money calculator.",
};

const faqs = [
  {
    question: "How does a TikTok money calculator work?",

    answer:

  },

  {
    question: "What is TikTok RPM?",

    answer:
      "RPM means estimated revenue per 1,000 views. Actual earnings can vary by region, niche, audience and monetization method.",
  },

  {
    question: "Are TikTok earnings guaranteed?",

    answer:

  },
];

export default function TiktokMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="TikTok Money Calculator"
      description="Estimate TikTok earnings instantly online."


      href="/tiktok-money-calculator"
      faqs={faqs}
    >
      <TiktokMoneyCalculatorClient />
    </ToolPageLayout>
  );
}