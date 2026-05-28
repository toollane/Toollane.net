import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import StartupNameGeneratorClient from "./StartupNameGeneratorClient";

export const metadata: Metadata = {
  title: "Startup Name Generator | Toollane",

  description:
    "Generate startup name ideas instantly with Toollane's free online startup name generator.",
};

const faqs = [
  {
    question: "What does a startup name generator do?",

    answer:

  },

  {
    question: "Who uses startup name generators?",

    answer:
      "Founders, SaaS creators, agencies and entrepreneurs use them to brainstorm startup names.",
  },

  {
    question: "Can I generate AI startup names?",

    answer:
      "Yes. You can enter AI, SaaS or tech-related keywords to generate relevant startup names.",
  },
];

export default function StartupNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Startup Name Generator"
      description="Generate startup name ideas instantly online."


      href="/startup-name-generator"
      faqs={faqs}
    >
      <StartupNameGeneratorClient />
    </ToolPageLayout>
  );
}