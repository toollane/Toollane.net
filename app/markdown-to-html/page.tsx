import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarkdownToHtmlClient from "./MarkdownToHtmlClient";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter | Toollane",

  description:
    "Convert Markdown to HTML instantly with Toollane's free online Markdown to HTML converter.",
};

const faqs = [
  {
    question:
      "What does a Markdown to HTML converter do?",

    answer:
      "A Markdown to HTML converter turns Markdown text into HTML code that can be used on websites, blogs, and apps.",
  },

  {
    question:
      "Is my text uploaded?",

    answer:

  },

  {
    question:
      "Can I copy the generated HTML?",

    answer:

  },
];

export default function MarkdownToHtmlPage() {
  return (
    <ToolPageLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to HTML instantly online."


      href="/markdown-to-html"
      faqs={faqs}
    >
      <MarkdownToHtmlClient />
    </ToolPageLayout>
  );
}