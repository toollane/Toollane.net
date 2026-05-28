import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UuidGeneratorClient from "./UuidGeneratorClient";

export const metadata: Metadata = {
  title: "UUID Generator | Toollane",

  description:
    "Generate random UUIDs instantly with Toollane's free online UUID generator.",
};

const faqs = [
  {
    question: "What is a UUID?",

    answer:
      "A UUID is a universally unique identifier commonly used in software systems, databases and APIs.",
  },

  {
    question: "Why use a UUID generator?",

    answer:
      "A UUID generator quickly creates unique IDs for development, testing and data records.",
  },

  {
    question: "Can UUIDs be used in databases?",

    answer:

  },
];

export default function UuidGeneratorPage() {
  return (
    <ToolPageLayout
      title="UUID Generator"
      description="Generate random UUIDs instantly online."


      href="/uuid-generator"
      faqs={faqs}
    >
      <UuidGeneratorClient />
    </ToolPageLayout>
  );
}