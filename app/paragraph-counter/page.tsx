import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ParagraphCounterClient from "./ParagraphCounterClient";

export const metadata: Metadata = {
  title: "Paragraph Counter | Toollane",

  description:
    "Count paragraphs and characters instantly with Toollane's free online paragraph counter.",
};

export default function ParagraphCounterPage() {
  return (
    <ToolPageLayout
      title="Paragraph Counter"
      description="Count paragraphs and characters instantly online."


      href="/paragraph-counter"
    >
      <ParagraphCounterClient />
    </ToolPageLayout>
  );
}