import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import TextDiffCheckerClient from "./TextDiffCheckerClient";

export const metadata: Metadata = {
  title: "Text Diff Checker | Toollane",

  description:
    "Compare two texts line by line with Toollane's free online text diff checker.",


  alternates: {
    canonical: "/text-diff-checker",
  },
};

export default function TextDiffCheckerPage() {
  return (
    <ToolPageLayout
      title="Text Diff Checker"
      description="Compare two texts line by line instantly online."


      href="/text-diff-checker"
    >
      <TextDiffCheckerClient />
    </ToolPageLayout>
  );
}