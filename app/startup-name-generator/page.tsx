import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import StartupNameGeneratorClient from "./StartupNameGeneratorClient";

export const metadata: Metadata = {
  title: "Startup Name Generator | Toollane",

  description:
    "Generate startup name ideas instantly with Toollane's free online startup name generator.",
};

export default function StartupNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="Startup Name Generator"
      description="Generate startup name ideas instantly online."


      href="/startup-name-generator"
    >
      <StartupNameGeneratorClient />
    </ToolPageLayout>
  );
}