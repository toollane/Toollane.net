import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CharacterCounterClient from "./CharacterCounterClient";

export const metadata: Metadata = {
  title: "Character Counter | Toollane",

  description:
    "Count characters, characters without spaces and lines instantly with Toollane's free online character counter.",


  alternates: {
    canonical: "/character-counter",
  },
};

export default function CharacterCounterPage() {
  return (
    <ToolPageLayout
      title="Character Counter"
      description="Count characters, characters without spaces and lines instantly online."


      href="/character-counter"
    >
      <CharacterCounterClient />
    </ToolPageLayout>
  );
}