import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomNumberGeneratorClient from "./RandomNumberGeneratorClient";

export const metadata: Metadata = {
  title: "Random Number Generator | Toollane",

  description:
    "Generate random numbers instantly with Toollane's free online random number generator.",
};

export default function RandomNumberGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Number Generator"
      description="Generate random numbers instantly online."


      href="/random-number-generator"
    >
      <RandomNumberGeneratorClient />
    </ToolPageLayout>
  );
}