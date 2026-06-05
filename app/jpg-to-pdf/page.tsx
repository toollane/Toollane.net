import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToPdfClient from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF Converter | Toollane",

  description:
    "Convert JPG images to PDF instantly with Toollane's free online JPG to PDF converter.",
};

export default function JpgToPdfPage() {
  return (
    <ToolPageLayout
      title="JPG to PDF Converter"
      description="Convert JPG images to PDF instantly online."


      href="/jpg-to-pdf"
    >
      <JpgToPdfClient />
    </ToolPageLayout>
  );
}