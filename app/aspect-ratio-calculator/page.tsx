import type { Metadata } from "next";

import AspectRatioCalculatorClient from "./AspectRatioCalculatorClient";

import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator | Toollane",

  description:
    "Calculate image and video aspect ratios instantly with Toollane's free online aspect ratio calculator.",
};

const faqs = [
  {
    question:
      "What is an aspect ratio?",

    answer:
      "An aspect ratio describes the proportional relationship between width and height.",
  },

  {
    question:
      "Why is aspect ratio important?",

    answer:
      "Maintaining aspect ratio prevents images and videos from appearing stretched or distorted.",
  },

  {
    question:
      "How do you calculate aspect ratio scaling?",

    answer:
      "Divide the new width by the original width and multiply the original height by that value.",
  },
];

export default function AspectRatioCalculatorPage() {
  return (
    <ToolPageLayout
      title="Aspect Ratio Calculator"
      description="Calculate image and video aspect ratios instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/aspect-ratio-calculator"
      faqs={faqs}
    >
      <AspectRatioCalculatorClient />
    </ToolPageLayout>
  );
}