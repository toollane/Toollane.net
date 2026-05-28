import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import BoxShadowGeneratorClient from "./BoxShadowGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator | Toollane",

  description:
    "Create CSS box shadows visually with Toollane's free online box shadow generator.",
};

const faqs = [
  {
    question: "What is a box shadow generator?",

    answer:

  },

  {
    question: "Can I copy the CSS code?",

    answer:

  },

  {
    question: "Who uses box shadow generators?",

    answer:
      "Web designers and developers use them to create shadows for cards, buttons and layouts.",
  },
];

export default function BoxShadowGeneratorPage() {
  return (
    <ToolPageLayout
      title="CSS Box Shadow Generator"
      description="Create CSS box shadows visually online."


      href="/box-shadow-generator"
      faqs={faqs}
    >
      <BoxShadowGeneratorClient />
    </ToolPageLayout>
  );
}