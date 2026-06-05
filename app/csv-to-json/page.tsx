import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CsvToJsonClient from "./CsvToJsonClient";

export const metadata: Metadata = {
  title: "CSV to JSON Converter | Toollane",

  description:
    "Convert CSV to JSON instantly with Toollane's free online CSV to JSON converter.",
};

export default function CsvToJsonPage() {
  return (
    <ToolPageLayout
      title="CSV to JSON Converter"
      description="Convert CSV data to JSON instantly online."


      href="/csv-to-json"
    >
      <CsvToJsonClient />
    </ToolPageLayout>
  );
}