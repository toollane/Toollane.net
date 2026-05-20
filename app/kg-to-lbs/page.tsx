import type { Metadata } from "next";

import KgToLbsClient from "./KgToLbsClient";
import ToolPageLayout from "@/components/ToolPageLayout";

export const metadata: Metadata = {
  title: "KG to LBS Converter | Toollane",
  description:
    "Convert kilograms to pounds instantly with Toollane's free online converter.",
};

const faqs = [
  {
    question: "How do you convert kilograms to pounds?",
    answer:
      "To convert kilograms to pounds, multiply the kilogram value by 2.20462.",
  },
  {
    question: "What is 1 kilogram in pounds?",
    answer: "1 kilogram equals approximately 2.20462 pounds.",
  },
  {
    question: "Why use a KG to LBS converter?",
    answer:
      "A converter helps you quickly and accurately convert metric weights into imperial pounds.",
  },
];

export default function KgToLbsPage() {
  return (
    <ToolPageLayout
      title="KG to LBS Converter"
      description="Convert kilograms to pounds instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/kg-to-lbs"
      faqs={faqs}
    >
      <KgToLbsClient />
    </ToolPageLayout>
  );
}