import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "JSON Formatter | Toollane",

  description:
    "Format and beautify JSON instantly with Toollane's free online JSON formatter.",
};

export default function JsonFormatterPage() {
  return (
    <ToolPageLayout
      title="JSON Formatter"
      description="Format and beautify JSON instantly online."


      href="/json-formatter"
    >
      <JsonFormatterClient />
    </ToolPageLayout>
  );
}