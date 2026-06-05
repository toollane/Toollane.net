import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import UuidGeneratorClient from "./UuidGeneratorClient";

export const metadata: Metadata = {
  title: "UUID Generator | Toollane",

  description:
    "Generate random UUIDs instantly with Toollane's free online UUID generator.",
};

export default function UuidGeneratorPage() {
  return (
    <ToolPageLayout
      title="UUID Generator"
      description="Generate random UUIDs instantly online."


      href="/uuid-generator"
    >
      <UuidGeneratorClient />
    </ToolPageLayout>
  );
}