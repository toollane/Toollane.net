import type { Metadata } from "next";

import LbsToKgClient from "./LbsToKgClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "LBS to KG Converter | Toollane",
  description:
    "Convert pounds to kilograms instantly with Toollane's free online converter.",
};

const faqs = [
  {
    question: "How do you convert pounds to kilograms?",
    answer:
      "To convert pounds to kilograms, divide the pound value by 2.20462.",
  },
  {
    question: "What is 1 pound in kilograms?",
    answer: "1 pound equals approximately 0.453592 kilograms.",
  },
  {
    question: "Why use an LBS to KG converter?",
    answer:
      "A converter helps you quickly convert imperial weight values into metric kilograms.",
  },
];

export default function LbsToKgPage() {
  return (
    <ToolPageLayout
      title="LBS to KG Converter"
      description="Convert pounds to kilograms instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/lbs-to-kg"
      faqs={faqs}
    >
      <LbsToKgClient />
    </ToolPageLayout>
  );
}