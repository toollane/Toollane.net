import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SocialMediaCharacterCounterClient from "./SocialMediaCharacterCounterClient";

export const metadata: Metadata = {
  title: "Social Media Character Counter | Toollane",

  description:
    "Count characters for social media posts, captions and titles with Toollane's free online character counter.",


  alternates: {
    canonical: "/social-media-character-counter",
  },
};

export default function SocialMediaCharacterCounterPage() {
  return (
    <ToolPageLayout
      title="Social Media Character Counter"
      description="Count characters for social media posts and captions instantly online."


      href="/social-media-character-counter"
    >
      <SocialMediaCharacterCounterClient />
    </ToolPageLayout>
  );
}