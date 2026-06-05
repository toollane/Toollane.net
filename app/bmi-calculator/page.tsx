import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BmiCalculatorClient from "./BmiCalculatorClient";

export const metadata: Metadata = {
  title: "BMI Calculator | Toollane",

  description:
    "Calculate your body mass index instantly with Toollane's free online BMI calculator.",
};

export default function BmiCalculatorPage() {
  return (
    <ToolPageLayout
      title="BMI Calculator"
      description="Calculate your body mass index instantly online."


      href="/bmi-calculator"
    >
      <BmiCalculatorClient />
    </ToolPageLayout>
  );
}