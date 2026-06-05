import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import HtmlMinifierClient from "./HtmlMinifierClient";

export const metadata: Metadata = {
  title:
    "HTML Minifier | Toollane",

  description:
    "Minify HTML instantly with Toollane's free online HTML minifier.",
};

export default function HtmlMinifierPage() {
  return (
    <ToolPageLayout
      title="HTML Minifier"
      description="Minify HTML code instantly online."


      href="/html-minifier"
    >
      <HtmlMinifierClient />
    </ToolPageLayout>
  );
}