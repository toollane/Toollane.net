import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CsvToJsonClient from "./CsvToJsonClient";

export const metadata: Metadata = {
  title: "CSV to JSON Converter | Toollane",

  description:
    "Convert CSV to JSON instantly with Toollane's free online CSV to JSON converter.",
};

const faqs = [
  {
    question: "What does a CSV to JSON converter do?",

    answer:

  },

  {
    question: "Can I use semicolon CSV files?",

    answer:

  },

  {
    question: "Who uses CSV to JSON converters?",

    answer:
      "Developers, analysts, students and office workers use them to transform spreadsheet data into structured JSON.",
  },
];

export default function CsvToJsonPage() {
  return (
    <ToolPageLayout
      title="CSV to JSON Converter"
      description="Convert CSV data to JSON instantly online."


      href="/csv-to-json"
      faqs={faqs}
    >
      <CsvToJsonClient />
    </ToolPageLayout>
  );
}