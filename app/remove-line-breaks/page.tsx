import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RemoveLineBreaksClient from "./RemoveLineBreaksClient";

export const metadata: Metadata = {
  title: "Remove Line Breaks | Toollane",

  description:
    "Remove line breaks from text instantly with Toollane's free online line break remover.",


  alternates: {
    canonical: "/remove-line-breaks",
  },
};

export default function RemoveLineBreaksPage() {
  return (
    <ToolPageLayout
      title="Remove Line Breaks"
      description="Remove line breaks from text instantly online."


      href="/remove-line-breaks"
    >
      <RemoveLineBreaksClient />
    </ToolPageLayout>
  );
}