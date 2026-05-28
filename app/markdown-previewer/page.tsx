import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarkdownPreviewerClient from "./MarkdownPreviewerClient";

export const metadata: Metadata = {
  title:
    "Markdown Previewer | Toollane",

  description:
    "Preview Markdown instantly with Toollane's free online Markdown previewer.",
};

const faqs = [
  {
    question:
      "What does a Markdown previewer do?",

    answer:

  },

  {
    question:
      "Who uses Markdown previewers?",

    answer:
      "Developers, bloggers, technical writers and GitHub users use Markdown previewers daily.",
  },

  {
    question:
      "Can I preview Markdown live?",

    answer:

  },
];

export default function MarkdownPreviewerPage() {
  return (
    <ToolPageLayout
      title="Markdown Previewer"
      description="Preview Markdown instantly online."


      href="/markdown-previewer"
      faqs={faqs}
    >
      <MarkdownPreviewerClient />
    </ToolPageLayout>
  );
}