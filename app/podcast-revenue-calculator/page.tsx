import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PodcastRevenueCalculatorClient from "./PodcastRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Podcast Revenue Calculator | Toollane",

  description:
    "Estimate podcast ad revenue from downloads, CPM and ad slots with Toollane's free online podcast revenue calculator.",
};

const faqs = [
  {
    question: "How does a podcast revenue calculator work?",

    answer:
      "It estimates podcast ad revenue using downloads, CPM and the number of ad slots per episode.",
  },

  {
    question: "What is podcast CPM?",

    answer:
      "Podcast CPM is estimated revenue per 1,000 downloads or listens.",
  },

  {
    question: "Are podcast revenue estimates exact?",

    answer:
      "No. Actual podcast revenue can vary by niche, audience, sponsor demand and ad placement.",
  },
];

export default function PodcastRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Podcast Revenue Calculator"
      description="Estimate podcast ad revenue instantly online."


      href="/podcast-revenue-calculator"
      faqs={faqs}
    >
      <PodcastRevenueCalculatorClient />
    </ToolPageLayout>
  );
}