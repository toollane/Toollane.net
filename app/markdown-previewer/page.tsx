import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import MarkdownPreviewerClient from "./MarkdownPreviewerClient";

export const metadata: Metadata = {
  title:
    "Markdown Previewer | Toollane",

  description:
    "Preview Markdown instantly with Toollane's free online Markdown previewer.",
};

export default function MarkdownPreviewerPage() {
  return (
    <ToolPageLayout
      title="Markdown Previewer"
      description="Preview Markdown instantly online."


      href="/markdown-previewer"
    >
      <MarkdownPreviewerClient />
    </ToolPageLayout>
  );
}