import type { Metadata } from "next";

import ToolPageLayout from "@/components/ToolPageLayout";

import JsonMinifierClient from "./JsonMinifierClient";

export const metadata: Metadata = {
  title: "JSON Minifier | Toollane",

  description:
    "Minify JSON instantly with Toollane's free online JSON minifier.",


  alternates: {
    canonical: "/json-minifier",
  },
};

export default function JsonMinifierPage() {
  return (
    <ToolPageLayout
      title="JSON Minifier"
      description="Minify JSON instantly online."


      href="/json-minifier"
    >
      <JsonMinifierClient />
    </ToolPageLayout>
  );
}