import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SqlFormatterClient from "./SqlFormatterClient";

export const metadata: Metadata = {
  title: "SQL Formatter | Toollane",

  description:
    "Format SQL queries instantly with Toollane's free online SQL formatter.",
};

const faqs = [
  {
    question: "What does a SQL formatter do?",

    answer:

  },

  {
    question: "Who uses SQL formatters?",

    answer:
      "Developers, data analysts, students and database administrators use SQL formatters to clean up queries.",
  },

  {
    question: "Can I copy the formatted SQL?",

    answer:
      "Yes. After formatting, you can copy the formatted SQL output.",
  },
];

export default function SqlFormatterPage() {
  return (
    <ToolPageLayout
      title="SQL Formatter"
      description="Format SQL queries instantly online."


      href="/sql-formatter"
      faqs={faqs}
    >
      <SqlFormatterClient />
    </ToolPageLayout>
  );
}