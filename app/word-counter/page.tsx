import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Word Counter | Toollane",

  description:
    "Count words, characters and sentences instantly with Toollane's free online word counter.",
};

export default function WordCounterPage() {
  return (
    <ToolPageLayout
      title="Word Counter"
      description="Count words, characters and sentences instantly online."


      href="/word-counter"
    >
      <WordCounterClient />
    </ToolPageLayout>
  );
}