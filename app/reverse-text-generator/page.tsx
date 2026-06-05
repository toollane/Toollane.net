import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import ReverseTextGeneratorClient from "./ReverseTextGeneratorClient";

export const metadata: Metadata = {
  title: "Reverse Text Generator | Toollane",

  description:
    "Reverse text instantly with Toollane's free online reverse text generator.",
};

export default function ReverseTextGeneratorPage() {
  return (
    <ToolPageLayout
      title="Reverse Text Generator"
      description="Reverse text instantly online."


      href="/reverse-text-generator"
    >
      <ReverseTextGeneratorClient />
    </ToolPageLayout>
  );
}