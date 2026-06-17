import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import InstagramMoneyCalculatorClient from "./InstagramMoneyCalculatorClient";

export const metadata: Metadata = {
  title: "Instagram Money Calculator | Toollane",

  description:
    "Estimate Instagram earnings and post value with Toollane's free online Instagram money calculator.",


  alternates: {
    canonical: "/instagram-money-calculator",
  },
};

export default function InstagramMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="Instagram Money Calculator"
      description="Estimate Instagram earnings and post value instantly online."


      href="/instagram-money-calculator"
    >
      <InstagramMoneyCalculatorClient />
    </ToolPageLayout>
  );
}