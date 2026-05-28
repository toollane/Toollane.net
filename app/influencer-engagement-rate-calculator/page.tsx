import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InfluencerEngagementRateCalculatorClient from "./InfluencerEngagementRateCalculatorClient";

export const metadata: Metadata = {
  title: "Influencer Engagement Rate Calculator | Toollane",

  description:
    "Calculate influencer engagement rate instantly with Toollane's free online engagement rate calculator.",
};

const faqs = [
  {
    question: "How do you calculate engagement rate?",

    answer:

  },

  {
    question: "What counts as engagement?",

    answer:
      "Engagement can include likes, comments, shares and other audience interactions.",
  },

  {
    question: "Why use an engagement rate calculator?",

    answer:
      "It helps creators, marketers and brands evaluate audience interaction and influencer performance.",
  },
];

export default function InfluencerEngagementRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Influencer Engagement Rate Calculator"
      description="Calculate influencer engagement rate instantly online."


      href="/influencer-engagement-rate-calculator"
      faqs={faqs}
    >
      <InfluencerEngagementRateCalculatorClient />
    </ToolPageLayout>
  );
}