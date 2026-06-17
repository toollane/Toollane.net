import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import YoutubeTitleGeneratorClient from "./YoutubeTitleGeneratorClient";

export const metadata: Metadata = {
  title: "YouTube Title Generator | Toollane",

  description:
    "Generate YouTube video title ideas instantly with Toollane's free online YouTube title generator.",


  alternates: {
    canonical: "/youtube-title-generator",
  },
};

export default function YoutubeTitleGeneratorPage() {
  return (
    <ToolPageLayout
      title="YouTube Title Generator"
      description="Generate YouTube video title ideas instantly online."


      href="/youtube-title-generator"
    >
      <YoutubeTitleGeneratorClient />
    </ToolPageLayout>
  );
}