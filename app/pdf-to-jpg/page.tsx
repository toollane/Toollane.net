import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import PdfToJpgClient from "./PdfToJpgClient";

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Toollane",

  description:
    "Convert PDF pages to JPG images instantly with Toollane's free online PDF to JPG converter.",
};

const faqs = [
  {
    question: "What does a PDF to JPG converter do?",

    answer:

  },

  {
    question: "Are my PDF files uploaded?",

    answer:

  },

  {
    question: "Can I convert multiple PDF pages?",

    answer:

  },
];

export default function PdfToJpgPage() {
  return (
    <ToolPageLayout
      title="PDF to JPG Converter"
      description="Convert PDF pages to JPG images instantly online."


      href="/pdf-to-jpg"
      faqs={faqs}
    >
      <PdfToJpgClient />
    </ToolPageLayout>
  );
}