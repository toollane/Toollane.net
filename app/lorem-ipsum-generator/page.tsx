import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import LoremIpsumGeneratorClient from "./LoremIpsumGeneratorClient";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator | Toollane",

  description:
    "Generate Lorem Ipsum dummy text instantly with Toollane's free online Lorem Ipsum generator.",
};

const faqs = [
  {
    question: "What is Lorem Ipsum?",

    answer:
      "Lorem Ipsum is placeholder text commonly used in design, publishing and web development.",
  },

  {
    question: "Can I generate multiple paragraphs?",

    answer:

  },

  {
    question: "Can this generate HTML paragraphs?",

    answer:

  },
];

export default function LoremIpsumGeneratorPage() {
  return (
    <ToolPageLayout
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum dummy text instantly online."


      href="/lorem-ipsum-generator"
      faqs={faqs}
    >
      <LoremIpsumGeneratorClient />
    </ToolPageLayout>
  );
}