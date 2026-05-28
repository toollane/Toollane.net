import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FaviconGeneratorClient from "./FaviconGeneratorClient";

export const metadata: Metadata = {
  title: "Favicon Generator | Toollane",

  description:
    "Create favicons instantly with Toollane's free online favicon generator.",
};

const faqs = [
  {
    question:
      "What does a favicon generator do?",

    answer:

  },

  {
    question:
      "Are my images uploaded?",

    answer:

  },

  {
    question:
      "Which favicon size does this tool create?",

    answer:

  },
];

export default function FaviconGeneratorPage() {
  return (
    <ToolPageLayout
      title="Favicon Generator"
      description="Create favicons instantly online."


      href="/favicon-generator"
      faqs={faqs}
    >
      <FaviconGeneratorClient />
    </ToolPageLayout>
  );
}