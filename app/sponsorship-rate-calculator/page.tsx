import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SponsorshipRateCalculatorClient from "./SponsorshipRateCalculatorClient";

export const metadata: Metadata = {
  title: "Sponsorship Rate Calculator | Toollane",

  description:
    "Estimate sponsorship rates from views, CPM and placements with Toollane's free online sponsorship rate calculator.",
};

const faqs = [
  {
    question: "How do you calculate sponsorship rates?",

    answer:
      "Sponsorship rates can be estimated by multiplying average views by CPM and dividing by 1,000.",
  },

  {
    question: "What is sponsorship CPM?",

    answer:
      "Sponsorship CPM is the estimated amount a sponsor pays per 1,000 views or impressions.",
  },

  {
    question: "Are sponsorship rates exact?",

    answer:
      "No. Actual rates can vary by niche, audience quality, platform, brand fit and negotiation.",
  },
];

export default function SponsorshipRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Sponsorship Rate Calculator"
      description="Estimate creator sponsorship pricing instantly online."


      href="/sponsorship-rate-calculator"
      faqs={faqs}
    >
      <SponsorshipRateCalculatorClient />
    </ToolPageLayout>
  );
}