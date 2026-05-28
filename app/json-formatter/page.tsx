import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter | Toollane",

  description:
    "Format and beautify JSON instantly with Toollane's free online JSON formatter.",
};

const faqs = [
  {
    question: "What does a JSON formatter do?",

    answer:

  },

  {
    question: "Can this tool detect invalid JSON?",

    answer:
      "Yes. If the JSON syntax is invalid, the tool shows an error message.",
  },

  {
    question: "Why use a JSON formatter?",

    answer:
      "It helps developers, analysts and students quickly inspect API responses and structured data.",
  },
];

export default function JsonFormatterPage() {
  return (
    <ToolPageLayout
      title="JSON Formatter"
      description="Format and beautify JSON instantly online."


      href="/json-formatter"
      faqs={faqs}
    >
      <JsonFormatterClient />
    </ToolPageLayout>
  );
}