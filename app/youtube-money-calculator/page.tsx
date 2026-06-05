import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeMoneyCalculatorClient from "./YoutubeMoneyCalculatorClient";

export const metadata: Metadata = {
  title:
    "YouTube Money Calculator | Toollane",

  description:
    "Estimate YouTube earnings instantly with Toollane's free online YouTube money calculator.",
};

export default function YoutubeMoneyCalculatorPage() {
  return (
    <ToolPageLayout
      title="YouTube Money Calculator"
      description="Estimate YouTube earnings instantly online."


      href="/youtube-money-calculator"
    >
      <YoutubeMoneyCalculatorClient />
    </ToolPageLayout>
  );
}