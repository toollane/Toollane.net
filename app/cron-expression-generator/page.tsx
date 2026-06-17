import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CronExpressionGeneratorClient from "./CronExpressionGeneratorClient";

export const metadata: Metadata = {
  title:
    "Cron Expression Generator | Toollane",

  description:
    "Generate cron expressions instantly with Toollane's free online cron expression generator.",


  alternates: {
    canonical: "/cron-expression-generator",
  },
};

export default function CronExpressionGeneratorPage() {
  return (
    <ToolPageLayout
      title="Cron Expression Generator"
      description="Generate cron expressions instantly online."


      href="/cron-expression-generator"
    >
      <CronExpressionGeneratorClient />
    </ToolPageLayout>
  );
}