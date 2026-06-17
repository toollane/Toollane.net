import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CsvCleanerClient from "./CsvCleanerClient";

export const metadata: Metadata = {
  title: "CSV Cleaner | Toollane",

  description:
    "Clean CSV data instantly with Toollane's free online CSV cleaner.",


  alternates: {
    canonical: "/csv-cleaner",
  },
};

export default function CsvCleanerPage() {
  return (
    <ToolPageLayout
      title="CSV Cleaner"
      description="Clean CSV data instantly online."


      href="/csv-cleaner"
    >
      <CsvCleanerClient />
    </ToolPageLayout>
  );
}