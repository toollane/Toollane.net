import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SentenceCounterClient from "./SentenceCounterClient";

export const metadata: Metadata = {
  title: "Sentence Counter | Toollane",

  description:
    "Count sentences and words instantly with Toollane's free online sentence counter.",
};

export default function SentenceCounterPage() {
  return (
    <ToolPageLayout
      title="Sentence Counter"
      description="Count sentences and words instantly online."


      href="/sentence-counter"
    >
      <SentenceCounterClient />
    </ToolPageLayout>
  );
}