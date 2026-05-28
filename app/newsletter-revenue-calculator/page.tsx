import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import NewsletterRevenueCalculatorClient from "./NewsletterRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Newsletter Revenue Calculator | Toollane",

  description:
    "Estimate newsletter sponsorship revenue from subscribers, open rate and CPM with Toollane's free online calculator.",
};

const faqs = [
  {
    question: "How do you calculate newsletter revenue?",

    answer:
      "Newsletter sponsorship revenue can be estimated by multiplying opens by sponsor CPM and dividing by 1,000.",
  },

  {
    question: "What is newsletter sponsor CPM?",

    answer:
      "Sponsor CPM is the estimated amount a sponsor pays per 1,000 newsletter opens.",
  },

  {
    question: "Are newsletter revenue estimates exact?",

    answer:
      "No. Actual revenue can vary by niche, audience quality, sponsor demand and placement format.",
  },
];

export default function NewsletterRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Newsletter Revenue Calculator"
      description="Estimate newsletter sponsorship revenue instantly online."


      href="/newsletter-revenue-calculator"
      faqs={faqs}
    >
      <NewsletterRevenueCalculatorClient />
    </ToolPageLayout>
  );
}