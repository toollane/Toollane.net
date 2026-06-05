import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import FindAndReplaceClient from "./FindAndReplaceClient";

export const metadata: Metadata = {
  title: "Find and Replace Tool | Toollane",

  description:
    "Find and replace text instantly with Toollane's free online find and replace tool.",
};

export default function FindAndReplacePage() {
  return (
    <ToolPageLayout
      title="Find and Replace Tool"
      description="Find and replace words, phrases or characters instantly online."


      href="/find-and-replace"
    >
      <FindAndReplaceClient />
    </ToolPageLayout>
  );
}