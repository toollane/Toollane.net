import type { Metadata } from "next";

import AspectRatioCalculatorClient from "./AspectRatioCalculatorClient";

import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator | Toollane",

  description:
    "Calculate image and video aspect ratios instantly with Toollane's free online aspect ratio calculator.",
};

export default function AspectRatioCalculatorPage() {
  return (
    <ToolPageLayout
      title="Aspect Ratio Calculator"
      description="Calculate image and video aspect ratios instantly online."


      href="/aspect-ratio-calculator"
    >
      <AspectRatioCalculatorClient />
    </ToolPageLayout>
  );
}