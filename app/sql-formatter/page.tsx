import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SqlFormatterClient from "./SqlFormatterClient";

export const metadata: Metadata = {
  title: "SQL Formatter | Toollane",

  description:
    "Format SQL queries instantly with Toollane's free online SQL formatter.",


  alternates: {
    canonical: "/sql-formatter",
  },
};

export default function SqlFormatterPage() {
  return (
    <ToolPageLayout
      title="SQL Formatter"
      description="Format SQL queries instantly online."


      href="/sql-formatter"
    >
      <SqlFormatterClient />
    </ToolPageLayout>
  );
}