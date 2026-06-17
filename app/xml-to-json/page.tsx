import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import XmlToJsonClient from "./XmlToJsonClient";

export const metadata: Metadata = {
  title:
    "XML to JSON Converter | Toollane",

  description:
    "Convert XML to JSON instantly with Toollane's free online XML to JSON converter.",


  alternates: {
    canonical: "/xml-to-json",
  },
};

export default function XmlToJsonPage() {
  return (
    <ToolPageLayout
      title="XML to JSON Converter"
      description="Convert XML data to JSON instantly online."


      href="/xml-to-json"
    >
      <XmlToJsonClient />
    </ToolPageLayout>
  );
}