import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HtmlMinifierClient from "./HtmlMinifierClient";

export const metadata: Metadata = {
  title:
    "HTML Minifier | Toollane",

  description:
    "Minify HTML instantly with Toollane's free online HTML minifier.",
};

const faqs = [
  {
    question:
      "What does an HTML minifier do?",

    answer:

  },

  {
    question:
      "Why minify HTML?",

    answer:

  },

  {
    question:
      "Who uses HTML minifiers?",

    answer:
      "Developers, SEO specialists and website owners use HTML minifiers to optimize websites.",
  },
];

export default function HtmlMinifierPage() {
  return (
    <ToolPageLayout
      title="HTML Minifier"
      description="Minify HTML code instantly online."


      href="/html-minifier"
      faqs={faqs}
    >
      <HtmlMinifierClient />
    </ToolPageLayout>
  );
}