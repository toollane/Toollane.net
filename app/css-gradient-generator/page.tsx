import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import CssGradientGeneratorClient from "./CssGradientGeneratorClient";

export const metadata: Metadata = {
  title: "CSS Gradient Generator | Toollane",

  description:
    "Create CSS gradients visually with Toollane's free online CSS gradient generator.",
};

const faqs = [
  {
    question: "What is a CSS gradient generator?",

    answer:

  },

  {
    question: "Can I change the colors?",

    answer:

  },

  {
    question: "Who uses CSS gradient generators?",

    answer:
      "Web designers and developers use them to create backgrounds, buttons and visual effects.",
  },
];

export default function CssGradientGeneratorPage() {
  return (
    <ToolPageLayout
      title="CSS Gradient Generator"
      description="Create CSS gradients visually and copy the code instantly."


      href="/css-gradient-generator"
      faqs={faqs}
    >
      <CssGradientGeneratorClient />
    </ToolPageLayout>
  );
}