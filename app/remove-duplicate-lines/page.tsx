import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RemoveDuplicateLinesClient from "./RemoveDuplicateLinesClient";

export const metadata: Metadata = {
  title: "Remove Duplicate Lines | Toollane",

  description:
    "Remove duplicate lines from text instantly with Toollane's free online duplicate line remover.",
};

export default function RemoveDuplicateLinesPage() {
  return (
    <ToolPageLayout
      title="Remove Duplicate Lines"
      description="Remove repeated lines from text instantly online."


      href="/remove-duplicate-lines"
    >
      <RemoveDuplicateLinesClient />
    </ToolPageLayout>
  );
}