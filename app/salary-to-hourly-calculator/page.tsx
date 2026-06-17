import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SalaryToHourlyCalculatorClient from "./SalaryToHourlyCalculatorClient";

export const metadata: Metadata = {
  title:
    "Salary to Hourly Calculator | Toollane",

  description:
    "Convert salary to hourly pay instantly with Toollane's free online salary to hourly calculator.",


  alternates: {
    canonical: "/salary-to-hourly-calculator",
  },
};

export default function SalaryToHourlyCalculatorPage() {
  return (
    <ToolPageLayout
      title="Salary to Hourly Calculator"
      description="Convert salary to hourly pay instantly online."


      href="/salary-to-hourly-calculator"
    >
      <SalaryToHourlyCalculatorClient />
    </ToolPageLayout>
  );
}