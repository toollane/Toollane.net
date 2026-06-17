import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RandomProfileGeneratorClient from "./RandomProfileGeneratorClient";

export const metadata: Metadata = {
  title: "Random Profile Generator | Toollane",

  description:
    "Generate random sample profiles instantly with Toollane's free online random profile generator.",


  alternates: {
    canonical: "/random-profile-generator",
  },
};

export default function RandomProfileGeneratorPage() {
  return (
    <ToolPageLayout
      title="Random Profile Generator"
      description="Generate fictional sample profiles instantly online."


      href="/random-profile-generator"
    >
      <RandomProfileGeneratorClient />
    </ToolPageLayout>
  );
}