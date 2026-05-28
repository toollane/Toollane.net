import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import AdRevenueCalculatorClient from "./AdRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Ad Revenue Calculator | Toollane",

  description:
    "Estimate ad revenue from pageviews and RPM with Toollane's free online ad revenue calculator.",
};

const faqs = [
  {
    question: "How does an ad revenue calculator work?",

    answer:
      "An ad revenue calculator estimates earnings by multiplying pageviews by RPM and dividing by 1,000.",
  },

  {
    question: "What is RPM?",

    answer:

  },

  {
    question: "Are ad revenue estimates exact?",

    answer:
      "No. Actual revenue can vary based on traffic source, country, ad placement, niche and monetization platform.",
  },
];

export default function AdRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Ad Revenue Calculator"
      description="Estimate website, blog or creator ad revenue instantly online."


      href="/ad-revenue-calculator"
      faqs={faqs}
    >
      <AdRevenueCalculatorClient />
    </ToolPageLayout>
  );
}