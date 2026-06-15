import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JpgToPdfClient from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF Converter | Convert JPG Images Online | Toollane",
  description:
    "Convert JPG images to PDF online for free. Upload multiple JPG files, arrange the page order, adjust page settings and download your PDF directly in your browser.",
};

export default function JpgToPdfPage() {
  return (
    <ToolPageLayout
      title="JPG to PDF Converter"
      description="Convert JPG images to PDF online. Upload multiple images, arrange the page order, adjust page settings and download the finished PDF directly in your browser."
      href="/jpg-to-pdf"
    >
      <JpgToPdfClient />
    </ToolPageLayout>
  );
}