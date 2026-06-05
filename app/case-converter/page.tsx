import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CaseConverterClient from "./CaseConverterClient";

export const metadata: Metadata = {
  title: "Case Converter | Toollane",

  description:
    "Convert text case instantly with Toollane's free online case converter.",
};

export default function CaseConverterPage() {
  return (
    <ToolPageLayout
      title="Case Converter"
      description="Convert text case instantly online."


      href="/case-converter"
    >
      <CaseConverterClient />
    </ToolPageLayout>
  );
}