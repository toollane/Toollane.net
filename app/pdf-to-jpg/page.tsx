import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfToJpgClient from "./PdfToJpgClient";

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Toollane",

  description:
    "Convert PDF pages to JPG images instantly with Toollane's free online PDF to JPG converter.",
};

export default function PdfToJpgPage() {
  return (
    <ToolPageLayout
      title="PDF to JPG Converter"
      description="Convert PDF pages to JPG images instantly online."


      href="/pdf-to-jpg"
    >
      <PdfToJpgClient />
    </ToolPageLayout>
  );
}