import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CaseConverterClient from "./CaseConverterClient";

export const metadata: Metadata = {
  title: "Case Converter | Toollane",

  description:
    "Convert text case instantly with Toollane's free online case converter.",
};

const faqs = [
  {
    question: "What does a case converter do?",

    answer:
      "A case converter changes text into formats like uppercase, lowercase, title case, camelCase, snake_case and kebab-case.",
  },

  {
    question: "Can I convert text to camelCase?",

    answer:
      "Yes. This tool can convert text into camelCase, snake_case and kebab-case.",
  },

  {
    question: "Why use a case converter?",

    answer:
      "A case converter helps writers, developers and marketers quickly reformat text.",
  },
];

export default function CaseConverterPage() {
  return (
    <ToolPageLayout
      title="Case Converter"
      description="Convert text case instantly online."


      href="/case-converter"
      faqs={faqs}
    >
      <CaseConverterClient />
    </ToolPageLayout>
  );
}