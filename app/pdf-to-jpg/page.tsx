import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfToJpgNoSsr from "./PdfToJpgNoSsr";

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Convert PDF Pages Online | Toollane",
  description:
    "Convert PDF pages to JPG images online for free. Upload a PDF, choose image quality and download every page as a JPG directly in your browser.",
};

export default function PdfToJpgPage() {
  return (
    <ToolPageLayout
      title="PDF to JPG Converter"
      description="Convert PDF pages to JPG images online. Choose image quality, output resolution and download every page as a JPG directly in your browser."
      href="/pdf-to-jpg"
    >
      <PdfToJpgNoSsr />
    </ToolPageLayout>
  );
}