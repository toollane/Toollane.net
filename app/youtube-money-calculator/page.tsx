import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeMoneyCalculatorClient from "./YoutubeMoneyCalculatorClient";

export const metadata: Metadata = {
  title:
    "YouTube Money Calculator | Toollane",

  description:
    "Estimate YouTube earnings instantly with Toollane's free online YouTube money calculator.",
};

const faqs = [
  {
    question:
      "How does a YouTube money calculator work?",

    answer:

  },

  {
    question:
      "What is YouTube CPM?",

    answer:
      "CPM means cost per thousand views and represents advertising revenue per 1,000 monetized views.",
  },

  {
    question:
      "Can I estimate earnings for viral videos?",

    answer:

  },
];

export default function YoutubeMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="YouTube Money Calculator"
      description="Estimate YouTube earnings instantly online."


      href="/youtube-money-calculator"
      faqs={faqs}
    >
      <YoutubeMoneyCalculatorClient />
    </ToolPageLayout>
  );
}