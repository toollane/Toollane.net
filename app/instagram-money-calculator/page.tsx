import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InstagramMoneyCalculatorClient from "./InstagramMoneyCalculatorClient";

export const metadata: Metadata = {
  title: "Instagram Money Calculator | Toollane",

  description:
    "Estimate Instagram earnings and post value with Toollane's free online Instagram money calculator.",
};

const faqs = [
  {
    question: "How does an Instagram money calculator work?",

    answer:
      "It estimates potential post value using followers, engagement rate and estimated value per engagement.",
  },

  {
    question: "Are Instagram earnings guaranteed?",

    answer:
      "No. Actual earnings vary by niche, audience quality, brand deals, region and creator reputation.",
  },

  {
    question: "What is engagement rate?",

    answer:
      "Engagement rate is the percentage of followers who interact with content through likes, comments, shares or similar actions.",
  },
];

export default function InstagramMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="Instagram Money Calculator"
      description="Estimate Instagram earnings and post value instantly online."


      href="/instagram-money-calculator"
      faqs={faqs}
    >
      <InstagramMoneyCalculatorClient />
    </ToolPageLayout>
  );
}