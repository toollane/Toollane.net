import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonToCsvClient from "./JsonToCsvClient";

export const metadata: Metadata = {
  title: "JSON to CSV Converter | Toollane",

  description:
    "Convert JSON to CSV instantly with Toollane's free online JSON to CSV converter.",
};

const faqs = [
  {
    question: "What does a JSON to CSV converter do?",

    answer:

  },

  {
    question: "Can I use semicolon-separated CSV?",

    answer:

  },

  {
    question: "Can I download the CSV file?",

    answer:
      "Yes. After conversion, you can download the generated CSV file.",
  },
];

export default function JsonToCsvPage() {
  return (
    <ToolPageLayout
      title="JSON to CSV Converter"
      description="Convert JSON data to CSV instantly online."


      href="/json-to-csv"
      faqs={faqs}
    >
      <JsonToCsvClient />
    </ToolPageLayout>
  );
}