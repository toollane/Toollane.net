import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import NewsletterRevenueCalculatorClient from "./NewsletterRevenueCalculatorClient";

export const metadata: Metadata = {
  title: "Newsletter Revenue Calculator | Toollane",

  description:
    "Estimate newsletter sponsorship revenue from subscribers, open rate and CPM with Toollane's free online calculator.",
};

export default function NewsletterRevenueCalculatorPage() {
  return (
    <ToolPageLayout
      title="Newsletter Revenue Calculator"
      description="Estimate newsletter sponsorship revenue instantly online."


      href="/newsletter-revenue-calculator"
    >
      <NewsletterRevenueCalculatorClient />
    </ToolPageLayout>
  );
}