import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CronExpressionGeneratorClient from "./CronExpressionGeneratorClient";

export const metadata: Metadata = {
  title:
    "Cron Expression Generator | Toollane",

  description:
    "Generate cron expressions instantly with Toollane's free online cron expression generator.",
};

const faqs = [
  {
    question:
      "What does a cron expression generator do?",

    answer:

  },

  {
    question:
      "Who uses cron expressions?",

    answer:
      "Developers, DevOps engineers and system administrators use cron expressions.",
  },

  {
    question:
      "Can I copy the cron expression?",

    answer:

  },
];

export default function CronExpressionGeneratorPage() {
  return (
    <ToolPageLayout
      title="Cron Expression Generator"
      description="Generate cron expressions instantly online."


      href="/cron-expression-generator"
      faqs={faqs}
    >
      <CronExpressionGeneratorClient />
    </ToolPageLayout>
  );
}