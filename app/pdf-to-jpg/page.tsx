import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfToJpgNoSsr from "./PdfToJpgNoSsr";

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Convert PDF Pages Online | Toollane",
  description:
    "Convert PDF pages to JPG images online for free. Upload a PDF, choose pages, image quality and output resolution, then download JPG files directly in your browser.",
};

export default function PdfToJpgPage() {
  return (
    <ToolPageLayout
      title="PDF to JPG Converter"
      description="Convert PDF pages to JPG images online. Choose pages, image quality, output resolution and download JPG files directly in your browser."
      href="/pdf-to-jpg"
    >
      <PdfToJpgNoSsr />
    </ToolPageLayout>
  );
}