import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNameGeneratorClient from "./RandomNameGeneratorClient";

export const metadata: Metadata = {
  title: "Random Name Generator | Toollane",

  description:
    "Generate random male, female and full names instantly with Toollane's free online random name generator.",
};

export default function RandomNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Name Generator"
      description="Generate random full names instantly online."


      href="/random-name-generator"
    >
      <RandomNameGeneratorClient />
    </ToolPageLayout>
  );
}