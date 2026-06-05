import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HtmlToMarkdownClient from "./HtmlToMarkdownClient";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter | Toollane",

  description:
    "Convert HTML to Markdown instantly with Toollane's free online HTML to Markdown converter.",
};

export default function HtmlToMarkdownPage() {
  return (
    <ToolPageLayout
      title="HTML to Markdown Converter"
      description="Convert HTML to Markdown instantly online."


      href="/html-to-markdown"
    >
      <HtmlToMarkdownClient />
    </ToolPageLayout>
  );
}