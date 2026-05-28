import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CsvCleanerClient from "./CsvCleanerClient";

export const metadata: Metadata = {
  title: "CSV Cleaner | Toollane",

  description:
    "Clean CSV data instantly with Toollane's free online CSV cleaner.",
};

const faqs = [
  {
    question: "What does a CSV cleaner do?",

    answer:
      "A CSV cleaner helps remove extra spaces, empty lines and formatting issues from CSV data.",
  },

  {
    question: "Can I use comma or semicolon CSV data?",

    answer:

  },

  {
    question: "Who uses CSV cleaners?",

    answer:
      "Office workers, analysts, students and developers use CSV cleaners to prepare data for spreadsheets and apps.",
  },
];

export default function CsvCleanerPage() {
  return (
    <ToolPageLayout
      title="CSV Cleaner"
      description="Clean CSV data instantly online."


      href="/csv-cleaner"
      faqs={faqs}
    >
      <CsvCleanerClient />
    </ToolPageLayout>
  );
}