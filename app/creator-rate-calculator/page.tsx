import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CreatorRateCalculatorClient from "./CreatorRateCalculatorClient";

export const metadata: Metadata = {
  title: "Creator Rate Calculator | Toollane",

  description:
    "Calculate creator project rates, usage fees and total pricing with Toollane's free online creator rate calculator.",
};

const faqs = [
  {
    question: "How do you calculate creator rates?",

    answer:

  },

  {
    question: "What are usage rights fees?",

    answer:
      "Usage rights fees are additional charges for brands to use creator content in paid ads, campaigns or long-term marketing.",
  },

  {
    question: "Are creator rates fixed?",

    answer:
      "No. Creator pricing can vary by audience, niche, content format, usage rights, deliverables and negotiation.",
  },
];

export default function CreatorRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Creator Rate Calculator"
      description="Calculate creator project rates and pricing instantly online."


      href="/creator-rate-calculator"
      faqs={faqs}
    >
      <CreatorRateCalculatorClient />
    </ToolPageLayout>
  );
}