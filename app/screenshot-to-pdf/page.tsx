import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ScreenshotToPdfClient from "./ScreenshotToPdfClient";

export const metadata: Metadata = {
  title: "Screenshot to PDF Converter | Convert Screenshots Online | Toollane",
  description:
    "Convert screenshots to PDF online for free. Upload mobile or desktop screenshots, arrange the page order, adjust PDF settings and download your PDF directly in your browser.",


  alternates: {
    canonical: "/screenshot-to-pdf",
  },
};

export default function ScreenshotToPdfPage() {
  return (
    <ToolPageLayout
      title="Screenshot to PDF Converter"
      description="Convert screenshots to PDF instantly online. Upload mobile or desktop screenshots, arrange the page order and download your PDF directly in your browser."
      href="/screenshot-to-pdf"
    >
      <ScreenshotToPdfClient />
    </ToolPageLayout>
  );
}