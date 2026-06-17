import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LoremIpsumGeneratorClient from "./LoremIpsumGeneratorClient";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator | Toollane",

  description:
    "Generate Lorem Ipsum dummy text instantly with Toollane's free online Lorem Ipsum generator.",


  alternates: {
    canonical: "/lorem-ipsum-generator",
  },
};

export default function LoremIpsumGeneratorPage() {
  return (
    <ToolPageLayout
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum dummy text instantly online."


      href="/lorem-ipsum-generator"
    >
      <LoremIpsumGeneratorClient />
    </ToolPageLayout>
  );
}