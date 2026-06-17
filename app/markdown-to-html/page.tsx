import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarkdownToHtmlClient from "./MarkdownToHtmlClient";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter | Toollane",

  description:
    "Convert Markdown to HTML instantly with Toollane's free online Markdown to HTML converter.",


  alternates: {
    canonical: "/markdown-to-html",
  },
};

export default function MarkdownToHtmlPage() {
  return (
    <ToolPageLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to HTML instantly online."


      href="/markdown-to-html"
    >
      <MarkdownToHtmlClient />
    </ToolPageLayout>
  );
}