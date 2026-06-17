import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import RobotsTxtGeneratorClient from "./RobotsTxtGeneratorClient";

export const metadata: Metadata = {
  title:
    "Robots.txt Generator | Toollane",

  description:
    "Generate robots.txt files instantly with Toollane's free online robots.txt generator.",


  alternates: {
    canonical: "/robots-txt-generator",
  },
};

export default function RobotsTxtGeneratorPage() {
  return (
    <ToolPageLayout
      title="Robots.txt Generator"
      description="Generate robots.txt files instantly online."


      href="/robots-txt-generator"
    >
      <RobotsTxtGeneratorClient />
    </ToolPageLayout>
  );
}