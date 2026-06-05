import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JavascriptMinifierClient from "./JavascriptMinifierClient";

export const metadata: Metadata = {
  title:
    "JavaScript Minifier | Toollane",

  description:
    "Minify JavaScript instantly with Toollane's free online JavaScript minifier.",
};

export default function JavascriptMinifierPage() {
  return (
    <ToolPageLayout
      title="JavaScript Minifier"
      description="Minify JavaScript code instantly online."


      href="/javascript-minifier"
    >
      <JavascriptMinifierClient />
    </ToolPageLayout>
  );
}