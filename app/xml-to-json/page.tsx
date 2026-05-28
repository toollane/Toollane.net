import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import XmlToJsonClient from "./XmlToJsonClient";

export const metadata: Metadata = {
  title:
    "XML to JSON Converter | Toollane",

  description:
    "Convert XML to JSON instantly with Toollane's free online XML to JSON converter.",
};

const faqs = [
  {
    question:
      "What does an XML to JSON converter do?",

    answer:
      "It converts XML data structures into JSON format for APIs, apps and development workflows.",
  },

  {
    question:
      "Who uses XML to JSON converters?",

    answer:
      "Developers, analysts, students and engineers use them to work with structured data.",
  },

  {
    question:
      "Does the conversion happen online?",

    answer:

  },
];

export default function XmlToJsonPage() {
  return (
    <ToolPageLayout
      title="XML to JSON Converter"
      description="Convert XML data to JSON instantly online."


      href="/xml-to-json"
      faqs={faqs}
    >
      <XmlToJsonClient />
    </ToolPageLayout>
  );
}