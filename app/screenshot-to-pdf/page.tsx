import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ScreenshotToPdfClient from "./ScreenshotToPdfClient";

export const metadata: Metadata = {
  title: "Screenshot to PDF Converter | Toollane",

  description:
    "Convert screenshots to PDF instantly with Toollane's free online screenshot to PDF converter.",
};

const faqs = [
  {
    question:
      "What does a screenshot to PDF converter do?",

    answer:

  },

  {
    question:
      "Are my screenshots uploaded?",

    answer:

  },

  {
    question:
      "Can I convert multiple screenshots?",

    answer:

  },
];

export default function ScreenshotToPdfPage() {
  return (
    <ToolPageLayout
      title="Screenshot to PDF Converter"
      description="Convert screenshots to PDF instantly online."


      href="/screenshot-to-pdf"
      faqs={faqs}
    >
      <ScreenshotToPdfClient />
    </ToolPageLayout>
  );
}