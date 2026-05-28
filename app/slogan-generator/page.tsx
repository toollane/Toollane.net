import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import SloganGeneratorClient from "./SloganGeneratorClient";

export const metadata: Metadata = {
  title: "Slogan Generator | Toollane",

  description:
    "Generate slogan ideas instantly with Toollane's free online slogan generator.",
};

const faqs = [
  {
    question: "What does a slogan generator do?",

    answer:
      "It creates slogan and tagline ideas for brands, startups and businesses.",
  },

  {
    question: "Who uses slogan generators?",

    answer:
      "Entrepreneurs, creators, agencies and marketers use them to brainstorm marketing ideas.",
  },

  {
    question: "Can I use my own keyword?",

    answer:

  },
];

export default function SloganGeneratorPage() {
  return (
    <ToolPageLayout
      title="Slogan Generator"
      description="Generate slogan ideas instantly online."


      href="/slogan-generator"
      faqs={faqs}
    >
      <SloganGeneratorClient />
    </ToolPageLayout>
  );
}