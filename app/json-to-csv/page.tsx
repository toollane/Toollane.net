import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonToCsvClient from "./JsonToCsvClient";

export const metadata: Metadata = {
  title: "JSON to CSV Converter | Toollane",

  description:
    "Convert JSON to CSV instantly with Toollane's free online JSON to CSV converter.",
};

export default function JsonToCsvPage() {
  return (
    <ToolPageLayout
      title="JSON to CSV Converter"
      description="Convert JSON data to CSV instantly online."


      href="/json-to-csv"
    >
      <JsonToCsvClient />
    </ToolPageLayout>
  );
}