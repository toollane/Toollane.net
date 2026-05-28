import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MemeGeneratorClient from "./MemeGeneratorClient";

export const metadata: Metadata = {
  title: "Meme Generator | Toollane",

  description:
    "Create memes instantly with Toollane's free online meme generator.",
};

const faqs = [
  {
    question:
      "What does a meme generator do?",

    answer:

  },

  {
    question:
      "Are my images uploaded?",

    answer:

  },

  {
    question:
      "Can I download my meme?",

    answer:

  },
];

export default function MemeGeneratorPage() {
  return (
    <ToolPageLayout
      title="Meme Generator"
      description="Create memes instantly online."


      href="/meme-generator"
      faqs={faqs}
    >
      <MemeGeneratorClient />
    </ToolPageLayout>
  );
}