import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HourlyToSalaryCalculatorClient from "./HourlyToSalaryCalculatorClient";

export const metadata: Metadata = {
  title:
    "Hourly to Salary Calculator | Toollane",

  description:
    "Convert hourly pay to annual salary instantly with Toollane's free online calculator.",
};

export default function HourlyToSalaryCalculatorPage() {
  return (
    <ToolPageLayout
      title="Hourly to Salary Calculator"
      description="Convert hourly pay to annual salary instantly online."


      href="/hourly-to-salary-calculator"
    >
      <HourlyToSalaryCalculatorClient />
    </ToolPageLayout>
  );
}