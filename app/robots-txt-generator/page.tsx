import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RobotsTxtGeneratorClient from "./RobotsTxtGeneratorClient";

export const metadata: Metadata = {
  title:
    "Robots.txt Generator | Toollane",

  description:
    "Generate robots.txt files instantly with Toollane's free online robots.txt generator.",
};

const faqs = [
  {
    question:
      "What does a robots.txt generator do?",

    answer:

  },

  {
    question:
      "Why is robots.txt important?",

    answer:

  },

  {
    question:
      "Who uses robots.txt generators?",

    answer:
      "SEO specialists, developers and website owners use robots.txt generators.",
  },
];

export default function RobotsTxtGeneratorPage() {
  return (
    <ToolPageLayout
      title="Robots.txt Generator"
      description="Generate robots.txt files instantly online."


      href="/robots-txt-generator"
      faqs={faqs}
    >
      <RobotsTxtGeneratorClient />
    </ToolPageLayout>
  );
}