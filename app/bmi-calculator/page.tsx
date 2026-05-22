import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BmiCalculatorClient from "./BmiCalculatorClient";

export const metadata: Metadata = {
  title: "BMI Calculator | Toollane",

  description:
    "Calculate your body mass index instantly with Toollane's free online BMI calculator.",
};

const faqs = [
  {
    question: "How do you calculate BMI?",

    answer:
      "BMI is calculated by dividing weight in kilograms by height in meters squared.",
  },

  {
    question: "What does BMI measure?",

    answer:
      "BMI is a simple estimate that compares body weight to height. It is commonly used as a general screening tool.",
  },

  {
    question: "Is BMI a medical diagnosis?",

    answer:
      "No. BMI is only a basic screening estimate and does not replace professional medical advice.",
  },
];

export default function BmiCalculatorPage() {
  return (
    <ToolPageLayout
      title="BMI Calculator"
      description="Calculate your body mass index instantly online."
      categoryName="Quick Math & Daily Calculators"
      categorySlug="quick-math-daily-calculators"
      href="/bmi-calculator"
      faqs={faqs}
    >
      <BmiCalculatorClient />
    </ToolPageLayout>
  );
}